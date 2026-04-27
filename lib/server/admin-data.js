import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import { checkNonNegative } from "@/lib/server/invariants";
import { getNextBusinessId } from "@/lib/server/business-ids";

import Customer from "@/lib/models/Customer";
import Expense from "@/lib/models/Expense";
import Invoice from "@/lib/models/Invoice";
import Material from "@/lib/models/Material";
import Order from "@/lib/models/Order";
import Payment from "@/lib/models/Payment";
import StockLog from "@/lib/models/StockLog";
import Supplier from "@/lib/models/Supplier";
import User from "@/lib/models/User";
import WorkLog from "@/lib/models/WorkLog";

const modelMap = {
  customer: Customer,
  employee: User,
  expense: Expense,
  invoice: Invoice,
  material: Material,
  order: Order,
  payment: Payment,
  stockLog: StockLog,
  supplier: Supplier,
  workLog: WorkLog,
};

const prefixMap = {
  customer: "CUST",
  employee: "EMP",
  expense: "EXP",
  invoice: "INV",
  material: "MAT",
  order: "ORD",
  payment: "PAY",
  stockLog: "SL",
  supplier: "SUP",
  workLog: "WL",
};

async function init() {
  await connectToDatabase();
}

function normalizeRole(session) {
  return typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
}

function assertAdminSession(session) {
  if (normalizeRole(session) !== "admin") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

function isEmployeeSession(session) {
  return normalizeRole(session) === "employee";
}

async function getUserFromSession(session) {
  const email = String(session?.user?.email || "").trim().toLowerCase();
  if (!email) {
    const error = new Error("Unauthorized.");
    error.status = 401;
    throw error;
  }

  await init();
  const user = await User.findOne({ email }).select("id name email role hourlyRate employeeType").lean();
  if (!user) {
    const error = new Error("User profile was not found.");
    error.status = 404;
    throw error;
  }
  return user;
}

function badRequestError(message, fields = null) {
  const error = new Error(message);
  error.status = 400;
  if (fields) {
    error.details = { fields };
  }
  return error;
}

function notFoundError(message) {
  const error = new Error(message);
  error.status = 404;
  return error;
}

function conflictError(message, fields = null) {
  const error = new Error(message);
  error.status = 409;
  if (fields) {
    error.details = { fields };
  }
  return error;
}

async function nextBusinessId(kind, { session } = {}) {
  const model = modelMap[kind];
  const prefix = prefixMap[kind];
  if (!model || !prefix) {
    throw new Error(`Unsupported business id kind: ${kind}`);
  }

  await init();

  const extraMatch = kind === "employee" ? { role: "employee" } : {};
  return getNextBusinessId({
    counterName: kind,
    model,
    prefix,
    extraMatch,
    session,
  });
}

function toPlain(doc) {
  if (!doc) return doc;
  return typeof doc?.toObject === "function" ? doc.toObject({ virtuals: false }) : doc;
}

async function listByModel(model, sort = { createdAt: -1 }, query = {}) {
  await init();
  return model.find(query).sort(sort).lean();
}

async function getByBusinessId(model, id, label) {
  await init();
  const row = await model.findOne({ id }).lean();
  if (!row) {
    throw notFoundError(`${label} ${id} was not found.`);
  }
  return toPlain(row);
}

async function deleteByBusinessId(model, id, label) {
  await init();
  const res = await model.deleteOne({ id });
  if (!res?.deletedCount) {
    throw notFoundError(`${label} ${id} was not found.`);
  }
  return { id };
}

export async function listCustomers(_payload, options = {}) {
  assertAdminSession(options.session);
  return listByModel(Customer, { createdAt: -1 });
}

export async function getCustomer(id, options = {}) {
  assertAdminSession(options.session);
  return getByBusinessId(Customer, id, "Customer");
}

export async function createCustomer(payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const phone = String(payload.phone || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const existing = await Customer.findOne({ $or: [{ phone }, { email }] }).lean();
  if (existing) {
    throw conflictError("Customer already exists.", {
      phone: existing.phone === phone ? "Phone already exists" : undefined,
      email: existing.email?.toLowerCase?.() === email ? "Email already exists" : undefined,
    });
  }

  const customer = await Customer.create({
    ...payload,
    email,
    id: payload.id?.trim() || (await nextBusinessId("customer")),
  });

  return { data: toPlain(customer), message: "Customer created." };
}

export async function updateCustomer(id, payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  if (payload.phone || payload.email) {
    const phone = payload.phone ? String(payload.phone).trim() : null;
    const email = payload.email ? String(payload.email).trim().toLowerCase() : null;
    const dupQuery = { id: { $ne: id }, $or: [] };
    if (phone) dupQuery.$or.push({ phone });
    if (email) dupQuery.$or.push({ email });
    if (dupQuery.$or.length) {
      const existing = await Customer.findOne(dupQuery).lean();
      if (existing) {
        throw conflictError("Customer already exists.", {
          phone: phone && existing.phone === phone ? "Phone already exists" : undefined,
          email: email && existing.email?.toLowerCase?.() === email ? "Email already exists" : undefined,
        });
      }
    }
  }

  const updates = { ...payload };
  if (typeof updates.email === "string") {
    updates.email = updates.email.trim().toLowerCase();
  }

  const customer = await Customer.findOneAndUpdate({ id }, updates, { new: true }).lean();
  if (!customer) {
    throw notFoundError(`Customer ${id} was not found.`);
  }
  return { data: toPlain(customer), message: "Customer updated." };
}

export async function deleteCustomer(id, options = {}) {
  assertAdminSession(options.session);
  await init();
  const linkedOrder = await Order.exists({ customerId: id });
  if (linkedOrder) {
    throw conflictError("Customer cannot be deleted while linked orders exist.");
  }
  return { data: await deleteByBusinessId(Customer, id, "Customer"), message: "Customer deleted." };
}

export async function listEmployees(_payload, options = {}) {
  assertAdminSession(options.session);
  const rows = await listByModel(User, { createdAt: -1 }, { role: "employee" });
  return rows.map((row) => ({
    _id: row._id,
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    employeeType: row.employeeType || "",
    hourlyRate: Number(row.hourlyRate || 0),
    createdAt: row.createdAt,
  }));
}

export async function getEmployee(id, options = {}) {
  assertAdminSession(options.session);
  const row = await getByBusinessId(User, id, "Employee");
  if (String(row.role || "").toLowerCase() !== "employee") {
    throw notFoundError(`Employee ${id} was not found.`);
  }
  return {
    _id: row._id,
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    employeeType: row.employeeType || "",
    hourlyRate: Number(row.hourlyRate || 0),
    createdAt: row.createdAt,
  };
}

export async function createEmployee(payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const email = String(payload.email || "").trim().toLowerCase();
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    throw conflictError("Employee already exists.", { email: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(String(payload.password || ""), 10);
  const id = payload.id?.trim() || (await nextBusinessId("employee"));

  const employee = await User.create({
    id,
    name: payload.name,
    email,
    passwordHash,
    role: "employee",
    employeeType: payload.employeeType,
    hourlyRate: Number(payload.hourlyRate || 0),
  });

  return { data: toPlain(employee), message: "Employee created." };
}

export async function updateEmployee(id, payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const existing = await User.findOne({ id }).lean();
  if (!existing || String(existing.role || "").toLowerCase() !== "employee") {
    throw notFoundError(`Employee ${id} was not found.`);
  }

  if (payload.email) {
    const email = String(payload.email || "").trim().toLowerCase();
    const dup = await User.findOne({ id: { $ne: id }, email }).lean();
    if (dup) {
      throw conflictError("Employee already exists.", { email: "Email already exists" });
    }
  }

  const updates = { ...payload };
  if (typeof updates.email === "string") {
    updates.email = updates.email.trim().toLowerCase();
  }
  if (typeof updates.password === "string" && updates.password.trim()) {
    updates.passwordHash = await bcrypt.hash(updates.password.trim(), 10);
  }
  delete updates.password;

  const employee = await User.findOneAndUpdate({ id }, updates, { new: true }).lean();
  if (!employee) {
    throw notFoundError(`Employee ${id} was not found.`);
  }

  return { data: toPlain(employee), message: "Employee updated." };
}

export async function deleteEmployee(id, options = {}) {
  assertAdminSession(options.session);
  await init();

  const existing = await User.findOne({ id }).lean();
  if (!existing || String(existing.role || "").toLowerCase() !== "employee") {
    throw notFoundError(`Employee ${id} was not found.`);
  }

  const linkedWorkLogs = await WorkLog.exists({ userId: id });
  if (linkedWorkLogs) {
    throw conflictError("Employee cannot be deleted while work logs exist.");
  }

  await Order.updateMany({ assignedEmployeeIds: id }, { $pull: { assignedEmployeeIds: id } });
  await User.deleteOne({ id });
  return { data: { id }, message: "Employee deleted." };
}

export async function listSuppliers(_payload, options = {}) {
  assertAdminSession(options.session);
  return listByModel(Supplier, { createdAt: -1 });
}

export async function getSupplier(id, options = {}) {
  assertAdminSession(options.session);
  return getByBusinessId(Supplier, id, "Supplier");
}

export async function createSupplier(payload, options = {}) {
  assertAdminSession(options.session);
  await init();
  const supplier = await Supplier.create({
    ...payload,
    id: payload.id?.trim() || (await nextBusinessId("supplier")),
  });
  return { data: toPlain(supplier), message: "Supplier created." };
}

export async function updateSupplier(id, payload, options = {}) {
  assertAdminSession(options.session);
  await init();
  const supplier = await Supplier.findOneAndUpdate({ id }, payload, { new: true }).lean();
  if (!supplier) {
    throw notFoundError(`Supplier ${id} was not found.`);
  }
  return { data: toPlain(supplier), message: "Supplier updated." };
}

export async function deleteSupplier(id, options = {}) {
  assertAdminSession(options.session);
  await init();
  const linkedMaterial = await Material.exists({ supplierId: id });
  if (linkedMaterial) {
    throw conflictError("Supplier cannot be deleted while linked materials exist.");
  }
  return { data: await deleteByBusinessId(Supplier, id, "Supplier"), message: "Supplier deleted." };
}

export async function listRawMaterials(_payload, options = {}) {
  assertAdminSession(options.session);
  return listByModel(Material, { createdAt: -1 });
}

export async function getRawMaterial(id, options = {}) {
  assertAdminSession(options.session);
  return getByBusinessId(Material, id, "Material");
}

export async function createRawMaterial(payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const duplicate = await Material.findOne({ name: String(payload.name || "").trim() }).lean();
  if (duplicate) {
    throw conflictError("Material already exists.", { name: "Material name already exists" });
  }

  const material = await Material.create({
    ...payload,
    id: payload.id?.trim() || (await nextBusinessId("material")),
  });
  return { data: toPlain(material), message: "Material created." };
}

export async function updateRawMaterial(id, payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const existing = await Material.findOne({ id }).lean();
  if (!existing) {
    throw notFoundError(`Material ${id} was not found.`);
  }

  if (payload.name) {
    const dup = await Material.findOne({ id: { $ne: id }, name: String(payload.name).trim() }).lean();
    if (dup) {
      throw conflictError("Material already exists.", { name: "Material name already exists" });
    }
  }

  const material = await Material.findOneAndUpdate({ id }, payload, { new: true }).lean();
  if (!material) {
    throw notFoundError(`Material ${id} was not found.`);
  }

  const prevQty = Number(existing.quantity || 0);
  const nextQty = Number(material.quantity || 0);
  const adminUser = await getUserFromSession(options.session);
  const performedByUserId = String(adminUser?.id || "").trim();

  const delta = nextQty - prevQty;
  if (delta !== 0) {
    await StockLog.create({
      id: await nextBusinessId("stockLog"),
      materialId: material.id,
      orderId: "",
      quantityChanged: Math.abs(delta),
      type: delta > 0 ? "IN" : "OUT",
      performedByUserId,
      date: new Date(),
    });
  }

  return { data: toPlain(material), message: "Material updated." };
}

export async function deleteRawMaterial(id, options = {}) {
  assertAdminSession(options.session);
  await init();
  const linkedOrder = await Order.exists({ "materialsUsed.materialId": id });
  if (linkedOrder) {
    throw conflictError("Material cannot be deleted while linked orders exist.");
  }
  const linkedLogs = await StockLog.exists({ materialId: id });
  if (linkedLogs) {
    throw conflictError("Material cannot be deleted while stock logs exist.");
  }
  return { data: await deleteByBusinessId(Material, id, "Material"), message: "Material deleted." };
}

export async function listOrders(_payload, options = {}) {
  assertAdminSession(options.session);
  await init();
  const rows = await Order.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => toPlain(row));
}

export async function getOrder(id, options = {}) {
  const role = normalizeRole(options.session);
  if (role !== "admin" && role !== "employee") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }

  await init();
  const order = await Order.findOne({ id }).lean();
  if (!order) {
    throw notFoundError(`Order ${id} was not found.`);
  }

  if (role === "employee") {
    const employee = await getUserFromSession(options.session);
    const assigned = Array.isArray(order.assignedEmployeeIds) && order.assignedEmployeeIds.includes(employee.id);
    if (!assigned) {
      const error = new Error("Forbidden.");
      error.status = 403;
      throw error;
    }
  }

  const workLogs = await WorkLog.find({ orderId: id })
    .select("id userId taskDescription progress hoursWorked workDate status wage approvedAt")
    .sort({ workDate: -1, createdAt: -1 })
    .lean();

  const latestProgressByUser = new Map();
  for (const log of workLogs) {
    const userId = String(log.userId || "").trim();
    if (!userId || latestProgressByUser.has(userId)) continue;
    latestProgressByUser.set(userId, Number(log.progress || 0));
  }

  return {
    ...toPlain(order),
    progressSummary: Array.from(latestProgressByUser.entries()).map(([userId, progress]) => ({ userId, progress })),
    workLogs: workLogs.map((log) => toPlain(log)),
  };
}

export async function assignWorkerToOrder({ orderId, userId }, options = {}) {
  assertAdminSession(options.session);
  await init();

  const order = await Order.findOne({ id: orderId });
  if (!order) {
    throw notFoundError(`Order ${orderId} was not found.`);
  }

  const user = await User.findOne({ id: userId }).lean();
  if (!user || String(user.role || "").toLowerCase() !== "employee") {
    throw notFoundError(`Employee ${userId} was not found.`);
  }

  const assignedEmployeeIds = Array.isArray(order.assignedEmployeeIds) ? order.assignedEmployeeIds : [];
  if (assignedEmployeeIds.includes(user.id)) {
    throw conflictError("Employee already assigned.", { userId: "Already assigned" });
  }

  assignedEmployeeIds.push(user.id);
  order.assignedEmployeeIds = assignedEmployeeIds;
  await order.save();

  return { data: toPlain(order), message: "Worker assigned." };
}

function pickInvoiceResponse(invoice) {
  if (!invoice) return null;
  return {
    _id: invoice._id,
    id: invoice.id,
    orderId: invoice.orderId,
    totalAmount: Number(invoice.totalAmount || 0),
    totalPaid: Number(invoice.totalPaid || 0),
    remainingBalance: Number(invoice.remainingBalance || 0),
    generatedDate: invoice.generatedDate,
    status: invoice.status,
  };
}

function computeInvoiceStatus(totalAmount, totalPaid) {
  const total = Number(totalAmount || 0);
  const paid = Number(totalPaid || 0);
  if (paid <= 0) return "Unpaid";
  if (paid >= total) return "Paid";
  return "Partial";
}

export async function listInvoices(_payload, options = {}) {
  assertAdminSession(options.session);
  const rows = await listByModel(Invoice, { createdAt: -1 });
  return rows.map((row) => pickInvoiceResponse(row)).filter(Boolean);
}

export async function getInvoice(id, options = {}) {
  assertAdminSession(options.session);
  const row = await getByBusinessId(Invoice, id, "Invoice");
  return pickInvoiceResponse(row);
}

export async function createInvoice(payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const orderId = String(payload?.orderId || "").trim();
  if (!orderId) {
    throw badRequestError("Missing orderId.", { orderId: "Required" });
  }

  const order = await Order.findOne({ id: orderId })
    .select("id status materialsUsed")
    .lean();
  if (!order) {
    throw notFoundError(`Order ${orderId} was not found.`);
  }

  if (order.status !== "completed") {
    throw badRequestError("Invoice can only be generated for completed orders.", {
      orderId: "Order status must be completed",
    });
  }

  const existing = await Invoice.findOne({ orderId: order.id }).lean();
  if (existing) {
    throw conflictError(`Invoice already exists for order ${order.id}.`, { orderId: "Invoice already exists" });
  }

  const materialsUsed = Array.isArray(order.materialsUsed) ? order.materialsUsed : [];
  const materialCost = materialsUsed.reduce(
    (sum, item) => sum + Number(item.quantityUsed || 0) * Number(item.priceAtTime || 0),
    0,
  );

  const approvedWorkLogs = await WorkLog.find({ orderId: order.id, status: "approved" })
    .select("wage")
    .lean();
  const laborCost = (approvedWorkLogs || []).reduce((sum, wl) => sum + Number(wl.wage || 0), 0);

  const totalAmount = materialCost + laborCost;
  checkNonNegative(totalAmount, {
    code: "invoice.totalAmount.non_negative",
    message: `Invoice totalAmount is negative for order ${order.id}.`,
    details: { orderId: order.id },
  });

  const invoice = await Invoice.create({
    id: await nextBusinessId("invoice"),
    orderId: order.id,
    totalAmount,
    generatedDate: new Date(),
    status: "Unpaid",
    totalPaid: 0,
    remainingBalance: totalAmount,
  });

  return { data: pickInvoiceResponse(toPlain(invoice)), message: "Invoice generated." };
}

export async function updateInvoice(_id, _payload, options = {}) {
  assertAdminSession(options.session);
  throw badRequestError("Invoices cannot be edited directly. Record payments to update balances.");
}

export async function deleteInvoice(id, options = {}) {
  assertAdminSession(options.session);
  await init();

  const payment = await Payment.exists({ invoiceId: id });
  if (payment) {
    throw conflictError("Invoice cannot be deleted while payments exist.");
  }

  await deleteByBusinessId(Invoice, id, "Invoice");
  return { data: { id }, message: "Invoice deleted." };
}

function pickPaymentResponse(payment) {
  if (!payment) return null;
  return {
    _id: payment._id,
    id: payment.id,
    invoiceId: payment.invoiceId,
    amount: Number(payment.amount || 0),
    paymentDate: payment.paymentDate,
  };
}

async function recalculateInvoice(invoiceId, { session } = {}) {
  const invoiceQuery = Invoice.findOne({ id: invoiceId });
  if (session) invoiceQuery.session(session);
  const invoice = await invoiceQuery;
  if (!invoice) {
    throw notFoundError(`Invoice ${invoiceId} was not found.`);
  }

  const paymentsQuery = Payment.find({ invoiceId }).select("amount").lean();
  if (session) paymentsQuery.session(session);
  const payments = await paymentsQuery;
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalAmount = Number(invoice.totalAmount || 0);
  checkNonNegative(totalAmount, {
    code: "invoice.totalAmount.non_negative",
    message: `Invoice ${invoiceId} totalAmount is negative.`,
    details: { invoiceId },
  });
  if (totalPaid > totalAmount) {
    const error = new Error(`Invoice ${invoiceId} payments exceed totalAmount.`);
    error.status = 500;
    throw error;
  }

  invoice.totalPaid = totalPaid;
  invoice.remainingBalance = totalAmount - totalPaid;
  invoice.status = computeInvoiceStatus(totalAmount, totalPaid);
  await invoice.save({ session });

  return pickInvoiceResponse(toPlain(invoice));
}

function buildPaymentValidationError(fields) {
  return badRequestError("Invalid payment.", fields);
}

export async function listPayments(_payload, options = {}) {
  assertAdminSession(options.session);
  const rows = await listByModel(Payment, { createdAt: -1 });
  return rows.map((row) => pickPaymentResponse(row)).filter(Boolean);
}

export async function getPayment(id, options = {}) {
  assertAdminSession(options.session);
  const row = await getByBusinessId(Payment, id, "Payment");
  return pickPaymentResponse(row);
}

export async function createPayment(payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const invoiceId = String(payload?.invoiceId || "").trim();
  const amount = Number(payload?.amount);
  const paymentDate = String(payload?.paymentDate || "").trim();

  const validationFields = {};
  if (!invoiceId) validationFields.invoiceId = "Required";
  if (!Number.isFinite(amount) || amount <= 0) validationFields.amount = "Must be > 0";
  if (!paymentDate || Number.isNaN(Date.parse(paymentDate))) validationFields.paymentDate = "Invalid date";
  if (Object.keys(validationFields).length > 0) {
    throw buildPaymentValidationError(validationFields);
  }

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const invoice = await Invoice.findOne({ id: invoiceId }).session(session);
      if (!invoice) {
        throw notFoundError(`Invoice ${invoiceId} was not found.`);
      }

      const remainingBalance = Number(invoice.remainingBalance || 0);
      if (amount > remainingBalance) {
        throw buildPaymentValidationError({ amount: "Must be <= remaining balance" });
      }

      const id = await nextBusinessId("payment", { session });
      const [payment] = await Payment.create([{ id, invoiceId, amount, paymentDate }], { session });

      await Invoice.updateOne(
        { id: invoiceId, remainingBalance: { $gte: amount } },
        { $inc: { totalPaid: amount, remainingBalance: -amount } },
        { session },
      );

      await recalculateInvoice(invoiceId, { session });

      await session.commitTransaction();
      return { data: pickPaymentResponse(toPlain(payment)), message: "Payment created." };
    } catch (error) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("[payments] abortTransaction failed", abortError);
      }
      if (attempt < maxAttempts && error?.hasErrorLabel?.("TransientTransactionError")) {
        continue;
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  throw new Error("Unexpected payment transaction failure.");
}

export async function updatePayment(id, payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const payment = await Payment.findOne({ id }).session(session);
    if (!payment) {
      throw notFoundError(`Payment ${id} was not found.`);
    }

    const nextInvoiceId =
      typeof payload?.invoiceId === "string" && payload.invoiceId.trim() ? payload.invoiceId.trim() : payment.invoiceId;
    const nextAmount = payload?.amount ?? payment.amount;
    const nextPaymentDate =
      typeof payload?.paymentDate === "string" && payload.paymentDate.trim() ? payload.paymentDate.trim() : payment.paymentDate;

    const validationFields = {};
    if (!nextInvoiceId) validationFields.invoiceId = "Required";
    if (!Number.isFinite(Number(nextAmount)) || Number(nextAmount) <= 0) validationFields.amount = "Must be > 0";
    if (!nextPaymentDate || Number.isNaN(Date.parse(nextPaymentDate))) validationFields.paymentDate = "Invalid date";
    if (Object.keys(validationFields).length > 0) {
      throw buildPaymentValidationError(validationFields);
    }

    const previousInvoiceId = payment.invoiceId;
    const invoice = await Invoice.findOne({ id: nextInvoiceId }).session(session);
    if (!invoice) {
      throw notFoundError(`Invoice ${nextInvoiceId} was not found.`);
    }

    // Temporarily remove current payment impact for validation.
    const payments = await Payment.find({ invoiceId: nextInvoiceId, id: { $ne: payment.id } })
      .select("amount")
      .session(session)
      .lean();
    const paidExcluding = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const remainingBalance = Number(invoice.totalAmount || 0) - paidExcluding;
    if (Number(nextAmount) > remainingBalance) {
      throw buildPaymentValidationError({ amount: "Must be <= remaining balance" });
    }

    payment.invoiceId = nextInvoiceId;
    payment.amount = Number(nextAmount);
    payment.paymentDate = nextPaymentDate;
    await payment.save({ session });

    await recalculateInvoice(previousInvoiceId, { session });
    if (nextInvoiceId !== previousInvoiceId) {
      await recalculateInvoice(nextInvoiceId, { session });
    }

    await session.commitTransaction();
    return { data: pickPaymentResponse(toPlain(payment)), message: "Payment updated." };
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error("[payments] abortTransaction failed", abortError);
    }
    throw error;
  } finally {
    session.endSession();
  }
}

export async function deletePayment(id, options = {}) {
  assertAdminSession(options.session);
  await init();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const payment = await Payment.findOne({ id }).session(session);
    if (!payment) {
      throw notFoundError(`Payment ${id} was not found.`);
    }

    const invoiceId = payment.invoiceId;
    await payment.deleteOne({ session });
    await recalculateInvoice(invoiceId, { session });

    await session.commitTransaction();
    return { data: { id }, message: "Payment deleted." };
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error("[payments] abortTransaction failed", abortError);
    }
    throw error;
  } finally {
    session.endSession();
  }
}

async function enrichWorkLogs(rows) {
  const logs = Array.isArray(rows) ? rows : [];
  const userIds = [...new Set(logs.map((row) => row.userId).filter(Boolean))];
  const users = userIds.length ? await User.find({ id: { $in: userIds } }).select("id name").lean() : [];
  const userMap = new Map(users.map((u) => [u.id, u.name]));

  return logs.map((row) => ({
    ...toPlain(row),
    employeeId: row.userId,
    userName: userMap.get(row.userId) || row.userId,
  }));
}

export async function listWorkLogs(_payload, options = {}) {
  await init();
  const query = isEmployeeSession(options.session) ? { userId: (await getUserFromSession(options.session)).id } : {};
  const rows = await WorkLog.find(query).sort({ workDate: -1, createdAt: -1 }).lean();
  return enrichWorkLogs(rows);
}

export async function getWorkLog(id, options = {}) {
  await init();
  const query = isEmployeeSession(options.session)
    ? { id, userId: (await getUserFromSession(options.session)).id }
    : { id };
  const log = await WorkLog.findOne(query).lean();
  if (!log) {
    throw notFoundError(`Work log ${id} was not found.`);
  }
  return (await enrichWorkLogs([log]))[0];
}

export async function createWorkLog(payload, options = {}) {
  await init();

  const sessionUser = isEmployeeSession(options.session) ? await getUserFromSession(options.session) : null;
  const nextUserId = sessionUser?.id || String(payload.userId || "").trim();
  if (!nextUserId) {
    throw badRequestError("Employee is required.", { userId: "Required" });
  }

  const user = await User.findOne({ id: nextUserId }).select("id role hourlyRate").lean();
  if (!user || String(user.role || "").toLowerCase() !== "employee") {
    throw notFoundError(`Employee ${nextUserId} was not found.`);
  }

  const order = await Order.findOne({ id: payload.orderId }).select("id assignedEmployeeIds").lean();
  if (!order) {
    throw notFoundError(`Order ${payload.orderId} was not found.`);
  }

  if (sessionUser) {
    const assigned = Array.isArray(order.assignedEmployeeIds) && order.assignedEmployeeIds.includes(sessionUser.id);
    if (!assigned) {
      const error = new Error("Forbidden.");
      error.status = 403;
      throw error;
    }
  }

  const normalized = { ...(payload || {}) };
  normalized.userId = user.id;
  normalized.status = "pending";
  normalized.approvedBy = "";
  normalized.approvedAt = null;
  normalized.wage = 0;

  const workLog = await WorkLog.create({
    ...normalized,
    id: payload.id?.trim() || (await nextBusinessId("workLog")),
  });

  return { data: await getWorkLog(workLog.id, options), message: "Work log recorded." };
}

export async function updateWorkLog(id, payload, options = {}) {
  await init();
  const query = isEmployeeSession(options.session)
    ? { id, userId: (await getUserFromSession(options.session)).id }
    : { id };
  const workLog = await WorkLog.findOne(query);
  if (!workLog) {
    throw notFoundError(`Work log ${id} was not found.`);
  }

  if (isEmployeeSession(options.session)) {
    if (payload.status && payload.status !== workLog.status) {
      const error = new Error("Forbidden.");
      error.status = 403;
      throw error;
    }

    Object.assign(workLog, {
      taskDescription: payload.taskDescription ?? workLog.taskDescription,
      hoursWorked: payload.hoursWorked ?? workLog.hoursWorked,
      workDate: payload.workDate ?? workLog.workDate,
      progress: payload.progress ?? workLog.progress,
    });
  } else {
    assertAdminSession(options.session);

    const nextStatus = payload.status ?? workLog.status;
    const nextProgress = payload.progress ?? workLog.progress;

    Object.assign(workLog, {
      taskDescription: payload.taskDescription ?? workLog.taskDescription,
      hoursWorked: payload.hoursWorked ?? workLog.hoursWorked,
      workDate: payload.workDate ?? workLog.workDate,
      progress: nextProgress,
      status: nextStatus,
    });

    if (nextStatus === "approved" || nextStatus === "rejected") {
      const adminUser = await getUserFromSession(options.session);
      workLog.approvedBy = String(adminUser.id || "").trim();
      workLog.approvedAt = new Date();
    } else {
      workLog.approvedBy = "";
      workLog.approvedAt = null;
      workLog.wage = 0;
    }
  }

  const user = await User.findOne({ id: workLog.userId }).select("hourlyRate role").lean();
  if (!user || String(user.role || "").toLowerCase() !== "employee") {
    throw notFoundError(`Employee ${workLog.userId} was not found.`);
  }

  if (workLog.status === "approved") {
    workLog.wage = Number(user.hourlyRate || 0) * Number(workLog.hoursWorked || 0);
  } else {
    workLog.wage = 0;
  }

  await workLog.save();
  return { data: await getWorkLog(id, options), message: "Work log updated." };
}

export async function deleteWorkLog(id, options = {}) {
  assertAdminSession(options.session);
  return { data: await deleteByBusinessId(WorkLog, id, "Work log"), message: "Work log deleted." };
}

export async function listExpenses(_payload, options = {}) {
  assertAdminSession(options.session);
  return listByModel(Expense, { date: -1, createdAt: -1 });
}

export async function getExpense(id, options = {}) {
  assertAdminSession(options.session);
  return getByBusinessId(Expense, id, "Expense");
}

export async function createExpense(payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const expense = await Expense.create({
    ...payload,
    id: payload.id?.trim() || (await nextBusinessId("expense")),
    date: new Date(payload.date),
  });

  return { data: toPlain(expense), message: "Expense recorded." };
}

export async function updateExpense(id, payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const updates = { ...payload };
  if (typeof updates.date === "string" && updates.date.trim()) {
    updates.date = new Date(updates.date);
  }

  const expense = await Expense.findOneAndUpdate({ id }, updates, { new: true }).lean();
  if (!expense) {
    throw notFoundError(`Expense ${id} was not found.`);
  }
  return { data: toPlain(expense), message: "Expense updated." };
}

export async function deleteExpense(id, options = {}) {
  assertAdminSession(options.session);
  return { data: await deleteByBusinessId(Expense, id, "Expense"), message: "Expense deleted." };
}

export async function getDashboardSummary(_payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const [customers, employees, orders, materials, invoices, expenses] = await Promise.all([
    Customer.countDocuments(),
    User.countDocuments({ role: "employee" }),
    Order.find().select("id customerId status estimatedCost createdAt").sort({ createdAt: -1 }).limit(5).lean(),
    Material.find().select("name unit quantity threshold pricePerUnit").lean(),
    Invoice.find().select("totalAmount remainingBalance").lean(),
    Expense.find().select("amount").lean(),
  ]);

  const activeOrders = (orders || []).filter((o) => o.status === "pending" || o.status === "in_progress").length;
  const lowQuantityAlerts = (materials || []).filter((m) => Number(m.threshold || 0) > 0 && Number(m.quantity || 0) < Number(m.threshold || 0)).length;
  const inventoryValue = (materials || []).reduce((sum, m) => sum + Number(m.quantity || 0) * Number(m.pricePerUnit || 0), 0);
  const totalRevenue = (invoices || []).reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);
  const outstandingInvoices = (invoices || []).filter((inv) => Number(inv.remainingBalance || 0) > 0).length;
  const totalExpenses = (expenses || []).reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  return {
    stats: {
      customers,
      employees,
      activeOrders,
      lowQuantityAlerts,
      totalRevenue,
      totalExpenses,
      outstandingInvoices,
      inventoryValue,
    },
    recentOrders: (orders || []).map((o) => ({
      id: o.id,
      customerId: o.customerId,
      status: o.status,
      estimatedCost: Number(o.estimatedCost || 0),
      createdAt: o.createdAt,
    })),
  };
}

export async function getDashboardAnalytics(_payload, options = {}) {
  assertAdminSession(options.session);
  await init();

  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const [payments, expenses] = await Promise.all([
    Payment.find().select("amount paymentDate").lean(),
    Expense.find().select("amount date").lean(),
  ]);

  const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  const keys = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  while (cursor <= end) {
    keys.push(monthKey(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const incomeByMonth = Object.fromEntries(keys.map((k) => [k, 0]));
  const expenseByMonth = Object.fromEntries(keys.map((k) => [k, 0]));

  for (const p of payments || []) {
    const dt = new Date(Date.parse(String(p.paymentDate || "")));
    if (!Number.isFinite(dt.getTime()) || dt < from) continue;
    const k = monthKey(dt);
    if (incomeByMonth[k] == null) incomeByMonth[k] = 0;
    incomeByMonth[k] += Number(p.amount || 0);
  }

  for (const e of expenses || []) {
    const dt = e.date instanceof Date ? e.date : new Date(Date.parse(String(e.date || "")));
    if (!Number.isFinite(dt.getTime()) || dt < from) continue;
    const k = monthKey(dt);
    if (expenseByMonth[k] == null) expenseByMonth[k] = 0;
    expenseByMonth[k] += Number(e.amount || 0);
  }

  const monthLabelFromKey = (key) => {
    const [y, m] = String(key).split("-");
    const monthIndex = Math.max(0, Math.min(11, Number(m) - 1));
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[monthIndex]} ${y}`;
  };

  return {
    monthlyFinance: keys.map((k) => ({
      month: monthLabelFromKey(k),
      income: Number(incomeByMonth[k] || 0),
      expenses: Number(expenseByMonth[k] || 0),
    })),
  };
}
