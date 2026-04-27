import { withApiContext } from "@/lib/api/observability";
import mongoose from "mongoose";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/lib/models/Customer";
import Material from "@/lib/models/Material";
import Order from "@/lib/models/Order";
import StockLog from "@/lib/models/StockLog";
import User from "@/lib/models/User";
import { getNextBusinessId } from "@/lib/server/business-ids";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess, parseJsonBody, zodErrorToFields } from "@/lib/api/response";

async function init() {
  await connectToDatabase();
}

function assertAdminSession(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (role !== "admin") {
    const error = new Error("You are not allowed to perform this action.");
    error.status = 403;
    throw error;
  }
}

async function getEmployeeUserFromSession(session) {
  const email = String(session?.user?.email || "").trim().toLowerCase();
  if (!email) {
    const error = new Error("Unauthorized.");
    error.status = 401;
    throw error;
  }

  const user = await User.findOne({ email, role: "employee" }).select("id role").lean();
  if (!user || String(user.role || "").toLowerCase() !== "employee") {
    const error = new Error("Employee profile was not found.");
    error.status = 404;
    throw error;
  }
  return user;
}

const uc02Schema = z.object({
  customerId: z.string().trim().min(1),
  description: z.string().trim().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  materialsUsed: z.array(
    z.object({
      materialId: z.string().trim().min(1),
      quantityUsed: z.coerce.number().gt(0),
    }),
  ).min(1),
});

export const GET = withApiContext(async () => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    await init();

    const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
    const query = role === "employee" ? { assignedEmployeeIds: (await getEmployeeUserFromSession(session)).id } : {};
    if (role !== "admin" && role !== "employee") {
      return apiError("Forbidden.", 403, { fields: {} });
    }

    const orders = await Order.find(query).sort({ _id: -1 }).lean();
    const data = (orders || []).map((row) => ({
      _id: row._id,
      id: row.id,
      customerId: row.customerId,
      description: row.description,
      status: row.status,
      estimatedCost: row.estimatedCost,
      materialsUsed: Array.isArray(row.materialsUsed)
        ? row.materialsUsed.map((item) => ({
            materialId: item.materialId,
            quantityUsed: item.quantityUsed,
            name: item.name || undefined,
            priceAtTime: item.priceAtTime ?? undefined,
          }))
        : [],
      ...(row.startDate ? { startDate: row.startDate } : {}),
      ...(row.endDate ? { endDate: row.endDate } : {}),
    }));

    return apiSuccess(data, "Orders loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load orders.");
  }
});

export const POST = withApiContext(async (request) => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    assertAdminSession(session);
    const body = await parseJsonBody(request);

    const uc02Parsed = uc02Schema.safeParse(body);
    if (!uc02Parsed.success) {
      return apiError("Invalid input", 400, { fields: zodErrorToFields(uc02Parsed.error) });
    }

    const validationFields = {};
    const startDateRaw = typeof uc02Parsed.data.startDate === "string" ? uc02Parsed.data.startDate.trim() : "";
    const endDateRaw = typeof uc02Parsed.data.endDate === "string" ? uc02Parsed.data.endDate.trim() : "";
    if (startDateRaw && Number.isNaN(Date.parse(startDateRaw))) validationFields.startDate = "Invalid date";
    if (endDateRaw && Number.isNaN(Date.parse(endDateRaw))) validationFields.endDate = "Invalid date";
    if (Object.keys(validationFields).length > 0) {
      return apiError("Invalid input", 400, { fields: validationFields });
    }

    await init();

    const mongoSession = await mongoose.startSession();
    try {
      let createdOrder;
      let warnings = [];

      await mongoSession.withTransaction(async () => {
        const { customerId, description, materialsUsed } = uc02Parsed.data;
        const adminEmail = String(session?.user?.email || "").trim().toLowerCase();
        const adminUser = adminEmail
          ? await User.findOne({ email: adminEmail, role: "admin" }).select("id").session(mongoSession).lean()
          : null;
        const performedByUserId = adminUser?.id ? String(adminUser.id) : "";

        const orderId = await getNextBusinessId({
          counterName: "order",
          model: Order,
          prefix: "ORD",
          session: mongoSession,
        });

        const requested = materialsUsed.reduce((acc, item) => {
          const materialId = item.materialId;
          acc[materialId] = (acc[materialId] || 0) + Number(item.quantityUsed || 0);
          return acc;
        }, {});

        const materialIds = Object.keys(requested).sort();

        const customer = await Customer.findOne({ id: customerId }).session(mongoSession).lean();
        if (!customer) {
          const notFound = new Error(`Customer ${customerId} was not found.`);
          notFound.status = 404;
          throw notFound;
        }

        const materials = await Material.find({ id: { $in: materialIds } })
          .select("id name unit quantity threshold pricePerUnit")
          .session(mongoSession)
          .lean();

        const materialMap = new Map(materials.map((mat) => [mat.id, mat]));
        const missing = materialIds.filter((id) => !materialMap.has(id));
        if (missing.length) {
          const notFound = new Error(`Material ${missing[0]} was not found.`);
          notFound.status = 404;
          throw notFound;
        }

        // Validate quantity for all materials first.
        for (const materialId of materialIds) {
          const material = materialMap.get(materialId);
          const qty = Number(requested[materialId] || 0);
          const currentQuantity = Number(material.quantity || 0);
          if (qty > currentQuantity) {
            const insufficient = new Error("One or more materials are out of stock");
            insufficient.status = 400;
            insufficient.details = {
              code: "INSUFFICIENT_STOCK",
              fields: { materialsUsed: "Requested quantity exceeds available stock" },
            };
            throw insufficient;
          }
        }

        // Compute estimated cost using pricePerUnit.
        const estimatedCost = materialIds.reduce((sum, materialId) => {
          const material = materialMap.get(materialId);
          const qty = Number(requested[materialId] || 0);
          if (material.pricePerUnit == null) {
            const failure = new Error(`Material ${material.id} missing pricePerUnit`);
            failure.status = 500;
            throw failure;
          }
          return sum + qty * material.pricePerUnit;
        }, 0);

        // Deduct quantity only after all checks pass.
        const stockLogs = [];
        for (const materialId of materialIds) {
          const qty = Number(requested[materialId] || 0);
          const updated = await Material.findOneAndUpdate(
            { id: materialId, quantity: { $gte: qty } },
            { $inc: { quantity: -qty } },
            { session: mongoSession, new: true },
          ).lean();
          if (!updated) {
            const insufficient = new Error("One or more materials are out of stock");
            insufficient.status = 400;
            insufficient.details = {
              code: "INSUFFICIENT_STOCK",
              fields: { materialsUsed: "Requested quantity exceeds available stock" },
            };
            throw insufficient;
          }

          stockLogs.push({
            id: `SL-${new mongoose.Types.ObjectId().toString()}`,
            materialId,
            orderId,
            quantityChanged: qty,
            type: "OUT",
            performedByUserId,
            date: new Date(),
          });
        }

        if (stockLogs.length) {
          await StockLog.create(stockLogs, { session: mongoSession });
        }

        // Reload updated quantities for warning computation.
        const updatedMaterials = await Material.find({ id: { $in: materialIds } })
          .select("id name unit quantity threshold pricePerUnit")
          .session(mongoSession)
          .lean();

        const lowMaterials = updatedMaterials
          .filter((material) => Number(material.quantity || 0) < Number(material.threshold || 0))
          .map((material) => ({
            materialId: material.id,
            message: `Low quantity for ${material.name}: ${material.quantity} ${material.unit} remaining (threshold ${material.threshold}).`,
          }));

        warnings = lowMaterials;

        const aggregatedMaterialsUsed = materialIds.map((materialId) => {
          const material = materialMap.get(materialId);
          return {
            materialId,
            quantityUsed: requested[materialId],
            name: material?.name || undefined,
            priceAtTime: material?.pricePerUnit ?? undefined,
          };
        });

        const orderPayload = {
          id: orderId,
          customerId: customer.id,
          description,
          status: "pending",
          estimatedCost,
          materialsUsed: aggregatedMaterialsUsed,
          ...(startDateRaw ? { startDate: new Date(startDateRaw) } : {}),
          ...(endDateRaw ? { endDate: new Date(endDateRaw) } : {}),
        };

        const created = await Order.create([orderPayload], { session: mongoSession });
        createdOrder = created?.[0]?.toObject({ virtuals: false }) || null;
      });

      const order = createdOrder
        ? {
            _id: createdOrder._id,
            id: createdOrder.id,
            customerId: createdOrder.customerId,
            description: createdOrder.description,
            status: createdOrder.status,
            estimatedCost: createdOrder.estimatedCost,
            materialsUsed: (createdOrder.materialsUsed || []).map((item) => ({
              materialId: item.materialId,
              quantityUsed: item.quantityUsed,
              name: item.name || undefined,
              priceAtTime: item.priceAtTime ?? undefined,
            })),
            ...(createdOrder.startDate ? { startDate: createdOrder.startDate } : {}),
            ...(createdOrder.endDate ? { endDate: createdOrder.endDate } : {}),
            ...(warnings.length ? { warnings } : {}),
          }
        : null;

      return apiSuccess(order, "Order created.", 201);
    } finally {
      mongoSession.endSession();
    }
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not create order.");
  }
});
