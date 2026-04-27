import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { connectToDatabase } from "@/lib/mongodb";

import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import WorkLog from "@/lib/models/WorkLog";

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

    const [employees, orders, approvedLogs] = await Promise.all([
      User.find({ role: "employee" }).select("id name employeeType").lean(),
      Order.find().select("assignedEmployeeIds").lean(),
      WorkLog.find({ status: "approved" }).select("userId hoursWorked workDate").lean(),
    ]);

    const inRange = (dt) => dt && dt >= from && dt <= to;

    const hoursByUserId = {};
    for (const row of approvedLogs || []) {
      const dt = new Date(Date.parse(String(row.workDate || "")));
      if (!Number.isFinite(dt.getTime()) || !inRange(dt)) continue;
      const userId = String(row.userId || "").trim();
      if (!userId) continue;
      hoursByUserId[userId] = (hoursByUserId[userId] || 0) + Number(row.hoursWorked || 0);
    }

    const jobsByUserId = {};
    for (const order of orders || []) {
      for (const userId of order.assignedEmployeeIds || []) {
        jobsByUserId[userId] = (jobsByUserId[userId] || 0) + 1;
      }
    }

    const performance = (employees || []).map((emp) => {
      const hours = Number(hoursByUserId[emp.id] || 0);
      const jobs = Number(jobsByUserId[emp.id] || 0);
      return {
        name: emp.name,
        role: emp.employeeType || "employee",
        jobs,
        hours,
      };
    });

    const totalWorkHours = performance.reduce((sum, row) => sum + row.hours, 0);
    const topPerformer = performance.slice().sort((a, b) => b.hours - a.hours)[0]?.name || "";

    const payload = {
      summary: {
        topPerformer,
        totalWorkHours,
      },
      performance,
    };

    return apiSuccess(payload, "Employee report loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load employee report.");
  }
});

