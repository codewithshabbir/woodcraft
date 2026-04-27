import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { connectToDatabase } from "@/lib/mongodb";

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

function durationDays(start, end) {
  if (!(start instanceof Date) || !(end instanceof Date)) return null;
  const ms = end.getTime() - start.getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  return Math.max(0, Math.round(ms / 86400000));
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
    const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const from = startDate || defaultFrom;
    const to = endDate || defaultTo;

    if (from > to) {
      return apiError("Invalid input", 400, { fields: { startDate: "Must be before endDate" } });
    }

    const orders = await Order.find({})
      .select("id status startDate endDate createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    const rows = (orders || [])
      .filter((o) => {
        const dt = o.createdAt instanceof Date ? o.createdAt : null;
        return dt && dt >= from && dt <= to;
      })
      .map((o) => {
        const start = o.startDate instanceof Date ? o.startDate : null;
        const end = o.endDate instanceof Date ? o.endDate : null;
        const days = durationDays(start, end);
        return {
          id: o.id,
          status: o.status,
          startDate: start,
          endDate: end,
          durationDays: days,
        };
      });

    const completed = rows.filter((r) => r.status === "completed" || r.status === "delivered");
    const durations = completed.map((r) => r.durationDays).filter((d) => typeof d === "number");
    const avgDays = durations.length ? Math.round(durations.reduce((s, d) => s + d, 0) / durations.length) : 0;
    const minDays = durations.length ? Math.min(...durations) : 0;
    const maxDays = durations.length ? Math.max(...durations) : 0;

    return apiSuccess(
      {
        summary: {
          completedOrders: completed.length,
          avgDays,
          minDays,
          maxDays,
        },
        orders: rows.slice(0, 30),
      },
      "Order timelines loaded.",
    );
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load order timelines.");
  }
});

