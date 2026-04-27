/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */

try {
  // Load local dev env if present (Next.js loads it automatically; this script does too).
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: ".env.local" });
} catch {}

const mongoose = require("mongoose");

const DEFAULT_BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_URI;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@woodcraft.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!";
const EMP_EMAIL = process.env.EMP_EMAIL || "emp-001@woodcraft.com";
const EMP_PASSWORD = process.env.EMP_PASSWORD || "EMP-001@123";

const CLEANUP = String(process.env.CLEANUP || "").trim() === "1";

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isBcryptHash(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  setFromResponse(response) {
    const raw = response.headers.getSetCookie?.() || [];
    for (const line of raw) {
      const first = String(line || "").split(";")[0];
      const eq = first.indexOf("=");
      if (eq === -1) continue;
      const name = first.slice(0, eq).trim();
      const value = first.slice(eq + 1).trim();
      if (!name) continue;
      this.cookies.set(name, value);
    }
  }

  header() {
    if (this.cookies.size === 0) return "";
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }
}

async function http(jar, method, path, { json, form, expectedStatus } = {}) {
  const url = `${DEFAULT_BASE_URL}${path}`;
  const headers = {};
  const cookieHeader = jar?.header?.() || "";
  if (cookieHeader) headers.cookie = cookieHeader;

  let body;
  if (json !== undefined) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form !== undefined) {
    headers["content-type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(form).toString();
  }

  const response = await fetch(url, { method, headers, body, redirect: "manual" });
  if (jar) jar.setFromResponse(response);

  const contentType = response.headers.get("content-type") || "";
  let payload;
  if (contentType.includes("application/json")) {
    try {
      payload = await response.json();
    } catch (err) {
      throw new Error(`${method} ${path} expected JSON but failed to parse response.`);
    }
  } else {
    try {
      payload = await response.text();
    } catch (err) {
      payload = "";
    }
  }

  if (expectedStatus != null && response.status !== expectedStatus) {
    throw new Error(
      `${method} ${path} expected ${expectedStatus} got ${response.status}: ${typeof payload === "string" ? payload.slice(0, 250) : JSON.stringify(payload).slice(0, 250)}`,
    );
  }

  // Enforce consistent response format for custom API routes.
  // NextAuth endpoints under /api/auth/* do not follow the { ok, data, message } envelope.
  if (
    String(path).startsWith("/api/") &&
    !String(path).startsWith("/api/auth") &&
    contentType.includes("application/json")
  ) {
    assert(payload && typeof payload === "object", `${method} ${path} expected JSON payload`);
    assert(typeof payload.ok === "boolean", `${method} ${path} missing ok:boolean`);
    if (payload.ok) {
      assert("data" in payload, `${method} ${path} missing data`);
      assert(typeof payload.message === "string", `${method} ${path} missing message`);
    } else {
      assert(payload.error && typeof payload.error === "object", `${method} ${path} missing error`);
      assert(typeof payload.error.code === "string", `${method} ${path} missing error.code`);
      assert(typeof payload.error.message === "string", `${method} ${path} missing error.message`);
      assert(payload.error.fields && typeof payload.error.fields === "object", `${method} ${path} missing error.fields`);
    }
  }

  return { response, payload };
}

async function signIn(email, password) {
  const jar = new CookieJar();
  const csrf = await http(jar, "GET", "/api/auth/csrf", { expectedStatus: 200 });
  const csrfToken = csrf?.payload?.csrfToken;
  assert(csrfToken, "Missing CSRF token from /api/auth/csrf");

  const callback = await http(jar, "POST", "/api/auth/callback/credentials", {
    form: {
      csrfToken,
      email,
      password,
      json: "true",
      callbackUrl: DEFAULT_BASE_URL,
    },
  });

  // NextAuth may respond with a redirect (302) or a JSON payload (200) depending on version/config.
  assert(
    callback?.response && [200, 302].includes(callback.response.status),
    `Unexpected status from /api/auth/callback/credentials: ${callback?.response?.status}`,
  );
  return jar;
}

function assertOk(payload, label) {
  if (!payload || payload.ok !== true) {
    throw new Error(`${label} failed: ${JSON.stringify(payload).slice(0, 400)}`);
  }
}

async function connectDb() {
  assert(MONGODB_URI, "Missing MONGODB_URI in environment. Export it or set it in .env.local.");
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    dbName: process.env.MONGODB_DB_NAME || "woodcraft",
  });
  return mongoose.connection.db;
}

function col(db, name) {
  return db.collection(name);
}

async function main() {
  const created = {
    employeeEmail: null,
    employeeId: null,
    supplierId: null,
    materialId: null,
    lowMaterialId: null,
    customerId: null,
    orderId: null,
    lowOrderId: null,
    workLogId: null,
    invoiceId: null,
    paymentId: null,
  };

  const suffix = uniqueSuffix();

  console.log(`[validate] Base URL: ${DEFAULT_BASE_URL}`);
  console.log("[validate] Connecting to MongoDB...");
  const db = await connectDb();

  console.log("[validate] Signing in as admin...");
  const adminJar = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);

  console.log("[UI] /signin loads...");
  {
    const signin = await http(adminJar, "GET", "/signin");
    assert(
      signin?.response && [200, 302, 307].includes(signin.response.status),
      `GET /signin unexpected status: ${signin?.response?.status}`,
    );
  }

  console.log("[UI] Admin can access /dashboard...");
  await http(adminJar, "GET", "/dashboard", { expectedStatus: 200 });

  console.log("[validate] Signing in as employee...");
  const employeeJar = await signIn(EMP_EMAIL, EMP_PASSWORD);

  console.log("[SEC] Employee blocked from /dashboard...");
  const employeeDashboard = await http(employeeJar, "GET", "/dashboard", { expectedStatus: 307 });
  assert(
    String(employeeDashboard.response.headers.get("location") || "").includes("/orders"),
    "Expected employee /dashboard redirect to /orders",
  );

  console.log("[SEC] Employee blocked from creating customer...");
  const employeeCreateCustomer = await http(employeeJar, "POST", "/api/customers", {
    expectedStatus: 403,
    json: { name: "X", phone: "1", email: "x@x.com", address: "X" },
  });
  assert(employeeCreateCustomer.payload.ok === false, "Expected employee create customer to fail");

  console.log("[UC01] Create Employee...");
  created.employeeEmail = `uc01-${suffix}@woodcraft.local`;
  const uc01 = await http(adminJar, "POST", "/api/employees", {
    expectedStatus: 201,
    json: {
      name: `UC01 Employee ${suffix}`,
      email: created.employeeEmail,
      password: "Emp12345!",
      employeeType: "carpenter",
      hourlyRate: 500,
    },
  });
  assertOk(uc01.payload, "UC01");
  created.employeeId = uc01.payload.data?.id;
  assert(created.employeeId, "UC01 missing employee id");

  const dbUser = await col(db, "users").findOne({ email: created.employeeEmail });
  assert(dbUser, "UC01 user missing in DB");
  assert(String(dbUser.role || "").toLowerCase() === "employee", "UC01 user role mismatch");
  assert(isBcryptHash(dbUser.passwordHash), "UC01 passwordHash is not bcrypt");

  console.log("[validate] Signing in as created employee...");
  const createdEmployeeJar = await signIn(created.employeeEmail, "Emp12345!");

  console.log("[UC05] Create Supplier + Material...");
  const supplier = await http(adminJar, "POST", "/api/suppliers", {
    expectedStatus: 201,
    json: {
      name: `UC05 Supplier ${suffix}`,
      phone: "0300-0000000",
      email: `supplier-${suffix}@woodcraft.local`,
      location: "Test City",
    },
  });
  assertOk(supplier.payload, "UC05 supplier");
  created.supplierId = supplier.payload.data?.id;
  assert(created.supplierId, "UC05 missing supplier id");
  assert(await col(db, "suppliers").findOne({ id: created.supplierId }), "UC05 supplier missing in DB");

  const material = await http(adminJar, "POST", "/api/materials", {
    expectedStatus: 201,
    json: {
      supplierId: created.supplierId,
      name: `UC05 Material ${suffix}`,
      unit: "pcs",
      pricePerUnit: 10,
      quantity: 100,
      threshold: 20,
    },
  });
  assertOk(material.payload, "UC05 material");
  created.materialId = material.payload.data?.id;
  assert(created.materialId, "UC05 missing material id");
  assert(await col(db, "materials").findOne({ id: created.materialId }), "UC05 material missing in DB");

  console.log("[UC14] Prepare event-based low-stock material (threshold crossing)...");
  const lowMaterial = await http(adminJar, "POST", "/api/materials", {
    expectedStatus: 201,
    json: {
      supplierId: created.supplierId,
      name: `UC14 Material ${suffix}`,
      unit: "pcs",
      pricePerUnit: 5,
      quantity: 21,
      threshold: 20,
    },
  });
  assertOk(lowMaterial.payload, "UC14 material");
  created.lowMaterialId = lowMaterial.payload.data?.id;
  assert(created.lowMaterialId, "UC14 missing lowMaterialId");

  console.log("[UC02] Create Customer...");
  const customer = await http(adminJar, "POST", "/api/customers", {
    expectedStatus: 201,
    json: {
      name: `UC02 Customer ${suffix}`,
      phone: `0300-${String(Math.floor(Math.random() * 10000000)).padStart(7, "0")}`,
      email: `customer-${suffix}@woodcraft.local`,
      address: "Test Address",
    },
  });
  assertOk(customer.payload, "UC02");
  created.customerId = customer.payload.data?.id;
  assert(created.customerId, "UC02 missing customer id");
  assert(await col(db, "customers").findOne({ id: created.customerId }), "UC02 customer missing in DB");

  console.log("[UC15] Cost Estimation (materials + labor)...");
  const estimation = await http(adminJar, "POST", "/api/cost-estimation", {
    expectedStatus: 200,
    json: {
      materialsUsed: [{ materialId: created.materialId, quantityUsed: 5 }],
      labor: [{ employeeId: created.employeeId, hours: 2 }],
    },
  });
  assertOk(estimation.payload, "UC15");
  assert(estimation.payload.data.totalCost > 0, "UC15 totalCost must be > 0");

  console.log("[EDGE] Create Order rejects missing customer...");
  await http(adminJar, "POST", "/api/orders", {
    expectedStatus: 404,
    json: {
      customerId: "CUST-DOES-NOT-EXIST",
      description: "bad",
      materialsUsed: [{ materialId: created.materialId, quantityUsed: 1 }],
    },
  });

  console.log("[EDGE] Create Order rejects insufficient stock...");
  await http(adminJar, "POST", "/api/orders", {
    expectedStatus: 400,
    json: {
      customerId: created.customerId,
      description: "insufficient stock",
      materialsUsed: [{ materialId: created.materialId, quantityUsed: 999999 }],
    },
  });

  console.log("[UC03/UC13] Create Order (auto-decrease stock + StockLogs)...");
  const before = await col(db, "materials").findOne({ id: created.materialId });
  assert(before, "Material missing before UC03");
  const beforeQty = Number(before.quantity || 0);

  const order = await http(adminJar, "POST", "/api/orders", {
    expectedStatus: 201,
    json: {
      customerId: created.customerId,
      description: `UC03 Order ${suffix}`,
      startDate: new Date().toISOString(),
      materialsUsed: [{ materialId: created.materialId, quantityUsed: 5 }],
    },
  });
  assertOk(order.payload, "UC03");
  created.orderId = order.payload.data?.id;
  assert(created.orderId, "UC03 missing order id");

  const after = await col(db, "materials").findOne({ id: created.materialId });
  assert(after, "Material missing after UC03");
  const afterQty = Number(after.quantity || 0);
  assert(afterQty === beforeQty - 5, `UC13 quantity mismatch (before=${beforeQty}, after=${afterQty})`);

  const outLog = await col(db, "stocklogs").findOne({
    orderId: created.orderId,
    materialId: created.materialId,
    type: "OUT",
    quantityChanged: 5,
  });
  assert(outLog, "UC13 missing StockLog OUT entry");

  console.log("[UC06] Assign Worker to Job...");
  const assign = await http(adminJar, "PATCH", `/api/orders/${created.orderId}`, {
    expectedStatus: 200,
    json: { userId: created.employeeId },
  });
  assertOk(assign.payload, "UC06");

  console.log("[UC11] Employee updates progress (Pending -> In Progress)...");
  const progress = await http(createdEmployeeJar, "PATCH", `/api/orders/${created.orderId}`, {
    expectedStatus: 200,
    json: { status: "in_progress" },
  });
  assertOk(progress.payload, "UC11");

  console.log("[EDGE] Invalid status transition rejected (in_progress -> pending)...");
  await http(adminJar, "PATCH", `/api/orders/${created.orderId}`, {
    expectedStatus: 400,
    json: { status: "pending" },
  });

  console.log("[UC12] Employee submits work hours -> pending...");
  const workLog = await http(createdEmployeeJar, "POST", "/api/work-logs", {
    expectedStatus: 201,
    json: {
      orderId: created.orderId,
      taskDescription: "UC12 Work log",
      progress: 50,
      hoursWorked: 2,
      workDate: isoDate(),
    },
  });
  assertOk(workLog.payload, "UC12 create");
  created.workLogId = workLog.payload.data?.id;
  assert(created.workLogId, "UC12 missing workLog id");

  const wlDb = await col(db, "worklogs").findOne({ id: created.workLogId });
  assert(wlDb, "UC12 worklog missing in DB");
  assert(String(wlDb.status || "").toLowerCase() === "pending", "UC12 worklog status not pending");

  console.log("[SEC] Employee cannot approve work logs...");
  await http(createdEmployeeJar, "PATCH", `/api/work-logs/${created.workLogId}`, {
    expectedStatus: 403,
    json: { status: "approved" },
  });

  console.log("[UC12] Admin approves -> wage calculated...");
  const approval = await http(adminJar, "PATCH", `/api/work-logs/${created.workLogId}`, {
    expectedStatus: 200,
    json: { status: "approved" },
  });
  assertOk(approval.payload, "UC12 approve");
  const wage = Number(approval.payload.data?.wage || 0);
  assert(wage === 500 * 2, `UC12 wage mismatch (expected=${500 * 2}, got=${wage})`);

  console.log("[EDGE] Invoice cannot be created before completion...");
  await http(adminJar, "POST", "/api/invoices", {
    expectedStatus: 400,
    json: { orderId: created.orderId },
  });

  console.log("[UC07] Complete order -> generate invoice...");
  const complete = await http(adminJar, "PATCH", `/api/orders/${created.orderId}`, {
    expectedStatus: 200,
    json: { status: "completed" },
  });
  assertOk(complete.payload, "Order complete");

  const invoice = await http(adminJar, "POST", "/api/invoices", {
    expectedStatus: 201,
    json: { orderId: created.orderId },
  });
  assertOk(invoice.payload, "UC07 invoice");
  created.invoiceId = invoice.payload.data?.id;
  assert(created.invoiceId, "UC07 missing invoice id");

  const invoiceDb = await col(db, "invoices").findOne({ id: created.invoiceId });
  assert(invoiceDb, "UC07 invoice missing in DB");
  const invoiceTotal = Number(invoiceDb.totalAmount || 0);
  assert(invoiceTotal === 5 * 10 + wage, `UC07 invoice total mismatch (expected=${5 * 10 + wage}, got=${invoiceTotal})`);

  console.log("[UC08] Payment prevents overpayment...");
  await http(adminJar, "POST", "/api/payments", {
    expectedStatus: 400,
    json: { invoiceId: created.invoiceId, amount: invoiceTotal + 1, paymentDate: isoDate() },
  });

  console.log("[UC08] Record payment -> remainingBalance updates...");
  const payAmount = Math.max(1, Math.floor(invoiceTotal / 2));
  const payment = await http(adminJar, "POST", "/api/payments", {
    expectedStatus: 201,
    json: { invoiceId: created.invoiceId, amount: payAmount, paymentDate: isoDate() },
  });
  assertOk(payment.payload, "UC08 payment");
  created.paymentId = payment.payload.data?.id;
  assert(created.paymentId, "UC08 missing payment id");

  const invoiceAfterPayment = await col(db, "invoices").findOne({ id: created.invoiceId });
  assert(invoiceAfterPayment, "Invoice missing after payment");
  assert(
    Number(invoiceAfterPayment.remainingBalance || 0) === invoiceTotal - payAmount,
    "UC08 remainingBalance not updated correctly",
  );

  console.log("[UC03/UC14] Create order that drops below threshold -> notifications reflect low stock...");

  const lowOrder = await http(adminJar, "POST", "/api/orders", {
    expectedStatus: 201,
    json: {
      customerId: created.customerId,
      description: `UC14 Order ${suffix}`,
      materialsUsed: [{ materialId: created.lowMaterialId, quantityUsed: 2 }],
    },
  });
  assertOk(lowOrder.payload, "UC14 order create");
  created.lowOrderId = lowOrder.payload.data?.id;
  assert(created.lowOrderId, "UC14 missing lowOrderId");

  const notifications1 = await http(adminJar, "GET", "/api/notifications", { expectedStatus: 200 });
  assertOk(notifications1.payload, "UC14 notifications after threshold drop");
  const lowItem1 = (notifications1.payload.data || []).find((n) => n && n.id === `low-${created.lowMaterialId}`);
  assert(lowItem1, "UC14 expected low stock notification after threshold drop");

  console.log("[UC14] Ensure notification stays stable if already below threshold...");
  const lowOrder2 = await http(adminJar, "POST", "/api/orders", {
    expectedStatus: 201,
    json: {
      customerId: created.customerId,
      description: `UC14 Order2 ${suffix}`,
      materialsUsed: [{ materialId: created.lowMaterialId, quantityUsed: 1 }],
    },
  });
  assertOk(lowOrder2.payload, "UC14 order2 create");
  const notifications2 = await http(adminJar, "GET", "/api/notifications", { expectedStatus: 200 });
  assertOk(notifications2.payload, "UC14 notifications after second consumption");
  const lowItems = (notifications2.payload.data || []).filter((n) => n && n.id === `low-${created.lowMaterialId}`);
  assert(lowItems.length === 1, "UC14 expected exactly one low stock notification item per material");

  console.log("[UC04] Track Order Status (GET order)...");
  const getOrder = await http(adminJar, "GET", `/api/orders/${created.orderId}`, { expectedStatus: 200 });
  assertOk(getOrder.payload, "UC04");
  assert(getOrder.payload.data.status === "completed", "UC04 expected completed status");

  console.log("[UC11] Admin marks Delivered (Completed -> Delivered)...");
  const delivered = await http(adminJar, "PATCH", `/api/orders/${created.orderId}`, {
    expectedStatus: 200,
    json: { status: "delivered" },
  });
  assertOk(delivered.payload, "Order delivered");

  console.log("[UC09/UC10] Reports endpoints respond...");
  const reports = [
    "/api/reports/employees",
    "/api/reports/inventory",
    "/api/reports/sales",
    "/api/reports/timelines",
  ];
  for (const path of reports) {
    const report = await http(adminJar, "GET", path, { expectedStatus: 200 });
    assertOk(report.payload, `Report ${path}`);
  }

  console.log("[validate] PASS: UC01–UC15 API + DB assertions passed.");

  if (CLEANUP) {
    console.log("[cleanup] Removing created test data...");
    await Promise.all([
      created.paymentId ? col(db, "payments").deleteMany({ id: created.paymentId }) : null,
      created.invoiceId ? col(db, "invoices").deleteMany({ id: created.invoiceId }) : null,
      created.workLogId ? col(db, "worklogs").deleteMany({ id: created.workLogId }) : null,
      created.orderId ? col(db, "orders").deleteMany({ id: created.orderId }) : null,
      created.lowOrderId ? col(db, "orders").deleteMany({ id: created.lowOrderId }) : null,
      created.customerId ? col(db, "customers").deleteMany({ id: created.customerId }) : null,
      created.materialId ? col(db, "materials").deleteMany({ id: created.materialId }) : null,
      created.lowMaterialId ? col(db, "materials").deleteMany({ id: created.lowMaterialId }) : null,
      created.supplierId ? col(db, "suppliers").deleteMany({ id: created.supplierId }) : null,
      created.employeeEmail ? col(db, "users").deleteMany({ email: created.employeeEmail }) : null,
    ].filter(Boolean));
    console.log("[cleanup] Done.");
  }
}

main()
  .catch((error) => {
    console.error("[validate] FAILED", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {}
  });
