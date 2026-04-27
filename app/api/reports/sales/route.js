import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { connectToDatabase } from "@/lib/mongodb";

import Invoice from "@/lib/models/Invoice";
import Payment from "@/lib/models/Payment";
import Expense from "@/lib/models/Expense";

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

function monthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabelFromKey(key) {
  const [y, m] = String(key).split("-");
  const monthIndex = Math.max(0, Math.min(11, Number(m) - 1));
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[monthIndex]} ${y}`;
}

function buildMonthKeys(fromDate, toDate) {
  const keys = [];
  const cursor = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
  const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
  while (cursor <= end) {
    keys.push(monthKey(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return keys;
}

function agingLabel(generatedDate) {
  const days = Math.max(0, Math.floor((Date.now() - generatedDate.getTime()) / 86400000));
  if (days <= 7) return "0-7 days";
  if (days <= 30) return "8-30 days";
  if (days <= 60) return "31-60 days";
  return "60+ days";
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

    const [payments, expenses, invoices] = await Promise.all([
      Payment.find().select("amount paymentDate invoiceId").lean(),
      Expense.find().select("amount date").lean(),
      Invoice.find().select("id orderId totalAmount remainingBalance generatedDate").lean(),
    ]);

    const inRange = (date) => date && date >= from && date <= to;

    const paymentRows = (payments || []).filter((row) => {
      const dt = new Date(Date.parse(String(row.paymentDate || "")));
      return Number.isFinite(dt.getTime()) && inRange(dt);
    });

    const expenseRows = (expenses || []).filter((row) => {
      const dt = row?.date instanceof Date ? row.date : new Date(Date.parse(String(row.date || "")));
      return Number.isFinite(dt.getTime()) && inRange(dt);
    });

    const monthKeys = buildMonthKeys(from, to);
    const incomeByMonth = Object.fromEntries(monthKeys.map((key) => [key, 0]));
    const expenseByMonth = Object.fromEntries(monthKeys.map((key) => [key, 0]));

    for (const row of paymentRows) {
      const dt = new Date(Date.parse(String(row.paymentDate || "")));
      const key = monthKey(dt);
      if (incomeByMonth[key] == null) incomeByMonth[key] = 0;
      incomeByMonth[key] += Number(row.amount || 0);
    }

    for (const row of expenseRows) {
      const dt = row?.date instanceof Date ? row.date : new Date(Date.parse(String(row.date || "")));
      const key = monthKey(dt);
      if (expenseByMonth[key] == null) expenseByMonth[key] = 0;
      expenseByMonth[key] += Number(row.amount || 0);
    }

    const monthlySales = monthKeys.map((key) => ({
      month: monthLabelFromKey(key),
      income: Number(incomeByMonth[key] || 0),
      expenses: Number(expenseByMonth[key] || 0),
    }));

    const totalIncome = monthlySales.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = monthlySales.reduce((sum, item) => sum + item.expenses, 0);

    const outstandingDue = (invoices || []).reduce((sum, inv) => sum + Math.max(0, Number(inv.remainingBalance || 0)), 0);

    const receivables = (invoices || [])
      .filter((inv) => Number(inv.remainingBalance || 0) > 0 && inv.generatedDate instanceof Date)
      .sort((a, b) => Number(b.remainingBalance || 0) - Number(a.remainingBalance || 0))
      .slice(0, 6)
      .map((inv) => ({
        invoice: inv.id,
        orderId: inv.orderId,
        due: Number(inv.remainingBalance || 0),
        aging: inv.generatedDate instanceof Date ? agingLabel(inv.generatedDate) : "",
      }));

    const payload = {
      monthlySales,
      summary: {
        totalIncome,
        totalExpenses,
        net: totalIncome - totalExpenses,
        outstandingDue,
      },
      receivables,
      paymentMix: {
        unclassified: totalIncome,
      },
      totalProcurement: totalExpenses,
    };

    return apiSuccess(payload, "Sales report loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load sales report.");
  }
});
