import { withApiContext } from "@/lib/api/observability";
import mongoose from "mongoose";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess, parseJsonBody, zodErrorToFields } from "@/lib/api/response";
import { assignWorkerToOrder } from "@/lib/server/admin-data";

import Invoice from "@/lib/models/Invoice";
import Material from "@/lib/models/Material";
import Order from "@/lib/models/Order";
import Payment from "@/lib/models/Payment";
import StockLog from "@/lib/models/StockLog";
import User from "@/lib/models/User";
import WorkLog from "@/lib/models/WorkLog";

const statusLifecycle = new Set(["pending", "in_progress", "completed", "delivered"]);
const employeeStatusLifecycle = new Set(["pending", "in_progress", "completed"]);
const businessIdPattern = /^[A-Za-z]{2,10}-[A-Za-z0-9-]+$/;

function assertRole(session, allowedRoles = []) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (!allowedRoles.includes(role)) {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

async function getEmployeeForSession(session) {
  const email = String(session?.user?.email || "").trim().toLowerCase();
  if (!email) {
    const error = new Error("Unauthorized.");
    error.status = 401;
    throw error;
  }
  const employee = await User.findOne({ email, role: "employee" }).select("id name email role").lean();
  if (!employee || String(employee.role || "").toLowerCase() !== "employee") {
    const error = new Error("Employee profile was not found.");
    error.status = 404;
    throw error;
  }
  return employee;
}

function orderResponse(order) {
  if (!order) return null;
  return {
    _id: order._id,
    id: order.id,
    customerId: order.customerId,
    description: order.description,
    status: order.status,
    estimatedCost: order.estimatedCost,
    materialsUsed: Array.isArray(order.materialsUsed)
      ? order.materialsUsed.map((item) => ({
          materialId: item.materialId,
          quantityUsed: item.quantityUsed,
          name: item.name || undefined,
          priceAtTime: item.priceAtTime ?? undefined,
        }))
      : [],
    ...(order.actualCost != null ? { actualCost: order.actualCost } : {}),
    ...(order.startDate != null ? { startDate: order.startDate } : {}),
    ...(order.endDate != null ? { endDate: order.endDate } : {}),
  };
}

export const GET = withApiContext(async (_request, { params }) => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    assertRole(session, ["admin", "employee"]);

    const { id: paramId } = await params;
    const rawId = typeof paramId === "string" ? paramId : "";
    const id = rawId.trim();
    if (!id) {
      return apiError("Invalid input", 400, { fields: { id: "Required" } });
    }
    if (!businessIdPattern.test(id)) {
      return apiError("Invalid input", 400, { fields: { id: "Invalid" } });
    }

    await connectToDatabase();

    const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
    const order = await Order.findOne({ id })
      .select("_id id customerId description status estimatedCost materialsUsed actualCost startDate endDate assignedEmployeeIds")
      .lean();

    if (!order) {
      return apiError("Order not found.", 404, { fields: {} });
    }
    if (!statusLifecycle.has(order.status)) {
      return apiError("Unexpected error.", 500, { fields: {} });
    }

    if (role === "employee") {
      const employee = await getEmployeeForSession(session);
      const assigned =
        Array.isArray(order.assignedEmployeeIds) &&
        order.assignedEmployeeIds.includes(employee.id);
      if (!assigned) {
        return apiError("Forbidden.", 403, { fields: {} });
      }
    }

    return apiSuccess(orderResponse(order), "Order loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load order.");
  }
});

const orderUpdateSchema = z.object({
  status: z.string().optional(),
  description: z.string().trim().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().trim().min(1).optional(),
});

export const PATCH = withApiContext(async (request, { params }) => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    const { id: paramId } = await params;
    const rawId = typeof paramId === "string" ? paramId : "";
    const id = rawId.trim();
    if (!id) {
      return apiError("Invalid input", 400, { fields: { id: "Required" } });
    }
    if (!businessIdPattern.test(id)) {
      return apiError("Invalid input", 400, { fields: { id: "Invalid" } });
    }

    const body = await parseJsonBody(request);
    const parsed = orderUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Invalid input", 400, { fields: zodErrorToFields(parsed.error) });
    }

    await connectToDatabase();

    // UC05 assignment update
    if (typeof parsed.data.userId === "string" && parsed.data.userId.trim()) {
      assertRole(session, ["admin"]);
      const userId = parsed.data.userId.trim();
      if (!businessIdPattern.test(userId)) {
        return apiError("Invalid input", 400, { fields: { userId: "Invalid" } });
      }
      const result = await assignWorkerToOrder({ orderId: id, userId }, { session });
      return apiSuccess(orderResponse(result.data), result.message);
    }

    const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
    const updates = {};

    if (parsed.data.description !== undefined) {
      updates.description = parsed.data.description;
    }

    if (parsed.data.startDate !== undefined) {
      const startDateRaw = String(parsed.data.startDate || "").trim();
      if (startDateRaw && Number.isNaN(Date.parse(startDateRaw))) {
        return apiError("Invalid input", 400, { fields: { startDate: "Invalid date" } });
      }
      updates.startDate = startDateRaw ? new Date(startDateRaw) : undefined;
    }

    if (parsed.data.endDate !== undefined) {
      const endDateRaw = String(parsed.data.endDate || "").trim();
      if (endDateRaw && Number.isNaN(Date.parse(endDateRaw))) {
        return apiError("Invalid input", 400, { fields: { endDate: "Invalid date" } });
      }
      updates.endDate = endDateRaw ? new Date(endDateRaw) : undefined;
    }

    if (parsed.data.status !== undefined) {
      const nextStatus = String(parsed.data.status || "").trim();
      if (!statusLifecycle.has(nextStatus)) {
        return apiError("Invalid input", 400, { fields: { status: "Invalid" } });
      }
      updates.status = nextStatus;
    }

    if (updates.status !== undefined) {
      const current = await Order.findOne({ id }).select("status").lean();
      if (!current) {
        return apiError("Order not found.", 404, { fields: {} });
      }

      const allowed = {
        pending: new Set(["pending", "in_progress"]),
        in_progress: new Set(["in_progress", "completed"]),
        completed: new Set(["completed", "delivered"]),
        delivered: new Set(["delivered"]),
      };

      const currentStatus = String(current.status || "").trim();
      const nextStatus = String(updates.status || "").trim();
      if (!allowed[currentStatus]?.has(nextStatus)) {
        return apiError("Invalid status transition.", 400, {
          fields: { status: `Cannot change status from ${currentStatus} to ${nextStatus}` },
        });
      }
    }

    if (role === "employee") {
      const payloadKeys = Object.keys(parsed.data).filter((key) => parsed.data[key] !== undefined);
      if (payloadKeys.length !== 1 || updates.status === undefined) {
        return apiError("Forbidden.", 403, { fields: {} });
      }
      if (!employeeStatusLifecycle.has(updates.status)) {
        return apiError("Invalid input", 400, { fields: { status: "Unsupported" } });
      }

      const employee = await getEmployeeForSession(session);
      const assignedOrder = await Order.findOne({ id }).select("id assignedEmployeeIds").lean();
      if (!assignedOrder) {
        return apiError("Order not found.", 404, { fields: {} });
      }
      const assigned =
        Array.isArray(assignedOrder.assignedEmployeeIds) &&
        assignedOrder.assignedEmployeeIds.includes(employee.id);
      if (!assigned) {
        return apiError("Forbidden.", 403, { fields: { status: "Unassigned task" } });
      }

      await Order.updateOne({ id }, { $set: { status: updates.status } });

      const refreshedOrder = await Order.findOne({ id })
        .select("_id id customerId description status estimatedCost materialsUsed actualCost startDate endDate")
        .lean();
      return apiSuccess(orderResponse(refreshedOrder), "Progress updated.");
    }

    assertRole(session, ["admin"]);

    if (Object.keys(updates).length === 0) {
      return apiError("Invalid input", 400, { fields: {} });
    }

    const order = await Order.findOneAndUpdate({ id }, { $set: updates }, { new: true })
      .select("_id id customerId description status estimatedCost materialsUsed actualCost startDate endDate")
      .lean();
    if (!order) {
      return apiError("Order not found.", 404, { fields: {} });
    }

    return apiSuccess(orderResponse(order), "Order updated.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not update order.");
  }
});

export const DELETE = withApiContext(async (_request, { params }) => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    assertRole(session, ["admin"]);

    const { id: paramId } = await params;
    const rawId = typeof paramId === "string" ? paramId : "";
    const id = rawId.trim();
    if (!id) {
      return apiError("Invalid input", 400, { fields: { id: "Required" } });
    }
    if (!businessIdPattern.test(id)) {
      return apiError("Invalid input", 400, { fields: { id: "Invalid" } });
    }

    await connectToDatabase();

    const [order, workLog, invoice] = await Promise.all([
      Order.findOne({ id }).lean(),
      WorkLog.exists({ orderId: id }),
      Invoice.findOne({ orderId: id }).select("id").lean(),
    ]);

    if (!order) {
      return apiError("Order not found.", 404, { fields: {} });
    }

    if (workLog) {
      return apiError("Order cannot be deleted while work logs exist.", 409, { fields: {} });
    }
    if (invoice) {
      const payment = await Payment.exists({ invoiceId: invoice.id });
      if (payment) {
        return apiError("Order cannot be deleted while payments exist.", 409, { fields: {} });
      }
      return apiError("Order cannot be deleted while an invoice exists.", 409, { fields: {} });
    }

    const mongoSession = await mongoose.startSession();
    try {
      await mongoSession.withTransaction(async () => {
        const adminEmail = String(session?.user?.email || "").trim().toLowerCase();
        const adminUser = adminEmail
          ? await User.findOne({ email: adminEmail, role: "admin" }).select("id").session(mongoSession).lean()
          : null;
        const performedByUserId = adminUser?.id ? String(adminUser.id) : "";

        const usages = Array.isArray(order.materialsUsed) ? order.materialsUsed : [];
        for (const usage of usages) {
          const qty = Number(usage.quantityUsed || 0);
          if (!usage.materialId || !Number.isFinite(qty) || qty <= 0) continue;
          await Material.updateOne({ id: usage.materialId }, { $inc: { quantity: qty } }, { session: mongoSession });
          await StockLog.create(
            [
              {
                id: `SL-${new mongoose.Types.ObjectId().toString()}`,
                materialId: usage.materialId,
                orderId: id,
                quantityChanged: qty,
                type: "IN",
                performedByUserId,
                date: new Date(),
              },
            ],
            { session: mongoSession },
          );
        }

        await Order.deleteOne({ id }, { session: mongoSession });
      });
    } finally {
      mongoSession.endSession();
    }

    return apiSuccess({ id }, "Order deleted.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not delete order.");
  }
});
