import fs from "node:fs";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!key) continue;
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");

const invoiceId = process.argv[2] || "INV-003";

const [{ connectToDatabase }, Invoice, Order, { recalculateInvoice }] = await Promise.all([
  import("@/lib/mongodb"),
  import("@/lib/models/Invoice").then((m) => m.default),
  import("@/lib/models/Order").then((m) => m.default),
  import("@/lib/server/admin-data"),
]);

await connectToDatabase();

const beforeInvoice = await Invoice.findOne({ id: invoiceId }).select("id orderId amount paid status").lean();
if (!beforeInvoice) {
  throw new Error(`Invoice ${invoiceId} not found`);
}

const orderId = String(beforeInvoice.orderId || "").trim();
const beforeOrder = orderId
  ? await Order.findOne({ id: orderId }).select("id paymentStatus").lean()
  : null;

await recalculateInvoice(invoiceId);

const afterInvoice = await Invoice.findOne({ id: invoiceId }).select("id orderId amount paid status").lean();
const afterOrder = orderId
  ? await Order.findOne({ id: orderId }).select("id paymentStatus").lean()
  : null;

process.stdout.write(
  `${JSON.stringify(
    {
      invoiceId,
      orderId,
      before: {
        invoice: { paid: beforeInvoice.paid, status: beforeInvoice.status },
        order: { paymentStatus: beforeOrder?.paymentStatus ?? null },
      },
      after: {
        invoice: { paid: afterInvoice?.paid ?? null, status: afterInvoice?.status ?? null },
        order: { paymentStatus: afterOrder?.paymentStatus ?? null },
      },
    },
    null,
    2,
  )}\n`,
);

