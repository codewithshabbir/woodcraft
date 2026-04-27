import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { connectToDatabase } from "@/lib/mongodb";
import Payment from "@/lib/models/Payment";
import Invoice from "@/lib/models/Invoice";
import WorkLog from "@/lib/models/WorkLog";
import User from "@/lib/models/User";

function assertAdminRole(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (role !== "admin") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

function isValidDateString(value) {
  return typeof value === "string" && value.trim() && !Number.isNaN(Date.parse(value));
}

function buildDateRangeFilter({ from, to } = {}) {
  const range = {};
  if (isValidDateString(from)) {
    range.$gte = new Date(from);
  } else if (from) {
    const error = new Error("Invalid input");
    error.status = 400;
    error.details = { fields: { from: "Invalid date" } };
    throw error;
  }

  if (isValidDateString(to)) {
    range.$lte = new Date(to);
  } else if (to) {
    const error = new Error("Invalid input");
    error.status = 400;
    error.details = { fields: { to: "Invalid date" } };
    throw error;
  }

  return Object.keys(range).length ? range : null;
}

async function getEmployeePerformance({ from, to }) {
  const dateRange = buildDateRangeFilter({ from, to });
  const match = { status: "approved" };
  if (dateRange) {
    match.workDate = dateRange;
  }

  const rows = await WorkLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$employeeId",
        totalHoursWorked: { $sum: "$hoursWorked" },
        totalWageCalculated: { $sum: "$wageCalculated" },
        workLogs: { $sum: 1 },
      },
    },
  ]);

  const userIds = rows.map((row) => row._id).filter(Boolean);
  const users = await User.find({ id: { $in: userIds } }).select("id name").lean();
  const userMap = new Map(users.map((user) => [user.id, user]));

  return rows.map((row) => ({
    userId: row._id,
    name: userMap.get(row._id)?.name || "",
    totalHoursWorked: row.totalHoursWorked,
    totalWageCalculated: row.totalWageCalculated,
    workLogs: row.workLogs,
  }));
}

async function getFinancialSummary({ from, to }) {
  const dateRange = buildDateRangeFilter({ from, to });

  const invoiceQuery = {};
  if (dateRange) {
    invoiceQuery.generatedDate = dateRange;
  }
  const paymentQuery = {};
  if (dateRange) {
    paymentQuery.paymentDate = dateRange;
  }

  const [invoices, payments] = await Promise.all([
    Invoice.find(invoiceQuery).select("totalAmount").lean(),
    Payment.find(paymentQuery).select("amount").lean(),
  ]);

  return {
    totalRevenue: invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0),
    paymentsReceived: payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
  };
}

async function getReports(request) {
  const { error, session } = await requireApiSession();
  if (error) {
    return error;
  }

  try {
    assertAdminRole(session);
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const type = String(searchParams.get("type") || "").trim();
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    if (!type) {
      return apiError("Invalid input", 400, { fields: { type: "Required" } });
    }

    if (type === "employeePerformance") {
      const data = await getEmployeePerformance({ from, to });
      return apiSuccess(data, "Employee performance report loaded.");
    }

    if (type === "financialSummary") {
      const data = await getFinancialSummary({ from, to });
      return apiSuccess(data, "Financial report loaded.");
    }

    return apiError("Invalid input", 400, { fields: { type: "Unsupported" } });
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load reports.");
  }
}

export const GET = withApiContext(getReports);
