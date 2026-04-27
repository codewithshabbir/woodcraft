import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { connectToDatabase } from "@/lib/mongodb";

import Material from "@/lib/models/Material";
import Order from "@/lib/models/Order";

function assertAdmin(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (role !== "admin") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

function parseDateParam(value, field) {
  if (value == null || value === "") return null;
  const parsed = Date.parse(String(value));
  if (Number.isNaN(parsed)) {
    const err = new Error("Invalid input");
    err.status = 400;
    err.details = { fields: { [field]: "Invalid date" } };
    throw err;
  }
  return new Date(parsed);
}

export const GET = withApiContext(async (request) => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    assertAdmin(session);
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const startDate = parseDateParam(searchParams.get("startDate"), "startDate");
    const endDate = parseDateParam(searchParams.get("endDate"), "endDate");

    const now = new Date();
    const defaultTo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const from = startDate || defaultFrom;
    const to = endDate || defaultTo;
    if (from > to) {
      return apiError("Invalid input", 400, { fields: { startDate: "Must be before endDate" } });
    }

    const [materials, orders] = await Promise.all([
      Material.find().select("id name unit quantity threshold pricePerUnit").lean(),
      Order.find().select("_id materialsUsed").lean(),
    ]);

    const orderRows = (orders || []).filter((row) => {
      const createdAt = row?._id?.getTimestamp ? row._id.getTimestamp() : null;
      return createdAt instanceof Date && createdAt >= from && createdAt <= to;
    });

    const consumedByMaterialId = {};
    for (const order of orderRows) {
      for (const usage of order.materialsUsed || []) {
        const materialId = String(usage.materialId || "").trim();
        if (!materialId) continue;
        consumedByMaterialId[materialId] = (consumedByMaterialId[materialId] || 0) + Number(usage.quantityUsed || 0);
      }
    }

    const trackedMaterials = (materials || []).length;
    const criticalAlerts = (materials || []).filter((m) => Number(m.threshold || 0) > 0 && Number(m.quantity || 0) < Number(m.threshold || 0)).length;
    const inventoryValue = (materials || []).reduce((sum, m) => sum + Number(m.quantity || 0) * Number(m.pricePerUnit || 0), 0);

    const usageRows = (materials || [])
      .map((m) => {
        const consumedQty = Number(consumedByMaterialId[m.id] || 0);
        const remainingQty = Number(m.quantity || 0);
        const denom = consumedQty + remainingQty;
        const consumedPercent = denom > 0 ? Math.min(100, Math.round((consumedQty / denom) * 100)) : 0;
        return {
          id: m.id,
          name: m.name,
          consumedQty,
          consumed: consumedPercent,
          remaining: `${remainingQty} ${m.unit}`,
        };
      })
      .sort((a, b) => b.consumedQty - a.consumedQty)
      .slice(0, 6);

    const fastMovingItems = usageRows.filter((row) => row.consumedQty > 0).length;

    const notes = [];
    if (criticalAlerts > 0) {
      notes.push(`${criticalAlerts} material(s) are below threshold and need procurement attention.`);
    } else {
      notes.push("All tracked materials are currently above their defined thresholds.");
    }
    if (fastMovingItems > 0) {
      notes.push(`${fastMovingItems} fast-moving item(s) detected in the selected range based on order consumption.`);
    } else {
      notes.push("No material consumption recorded for the selected range.");
    }
    notes.push("Replenish stock by updating material quantities and keep thresholds meaningful for alerts.");

    const payload = {
      summary: {
        trackedMaterials,
        criticalAlerts,
        fastMovingItems,
        inventoryValue,
      },
      inventoryUsage: usageRows.map((row) => ({
        name: row.name,
        consumed: row.consumed,
        remaining: row.remaining,
      })),
      notes,
    };

    return apiSuccess(payload, "Inventory report loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load inventory report.");
  }
});
