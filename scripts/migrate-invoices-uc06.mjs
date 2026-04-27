import mongoose from "mongoose";

import { connectToDatabase } from "../lib/mongodb.js";
import Invoice from "../lib/models/Invoice.js";
import Order from "../lib/models/Order.js";

function computeInvoiceTotalAmount(order) {
  const hasActual = typeof order?.actualCost === "number" && Number.isFinite(order.actualCost);
  return hasActual ? Number(order.actualCost) : Number(order?.estimatedCost || 0);
}

async function main() {
  await connectToDatabase();

  const query = {
    $or: [
      { generatedDate: { $exists: false } },
      { generatedDate: null },
      { totalAmount: { $exists: false } },
      { totalAmount: null },
      { amount: { $exists: true } },
      { paid: { $exists: true } },
      { customer: { $exists: true } },
      { dueDate: { $exists: true } },
      { notes: { $exists: true } },
    ],
  };

  const cursor = Invoice.find(query).cursor();

  let scanned = 0;
  let updated = 0;
  let skippedMissingOrder = 0;

  for await (const invoice of cursor) {
    scanned += 1;

    const orderId = String(invoice.orderId || "").trim();
    const order = orderId ? await Order.findOne({ id: orderId }).select("id estimatedCost actualCost").lean() : null;

    if (!order) {
      skippedMissingOrder += 1;
      continue;
    }

    const next = {};
    const unset = {};

    if (!invoice.generatedDate) {
      next.generatedDate = invoice.createdAt || new Date();
    }

    if (typeof invoice.totalAmount !== "number" || !Number.isFinite(invoice.totalAmount)) {
      next.totalAmount = computeInvoiceTotalAmount(order);
    }

    if (!invoice.status) {
      next.status = "generated";
    }

    for (const key of ["amount", "paid", "customer", "dueDate", "notes"]) {
      if (invoice.get(key) !== undefined) {
        unset[key] = "";
      }
    }

    if (Object.keys(next).length === 0 && Object.keys(unset).length === 0) {
      continue;
    }

    await Invoice.updateOne(
      { _id: invoice._id },
      {
        ...(Object.keys(next).length ? { $set: next } : {}),
        ...(Object.keys(unset).length ? { $unset: unset } : {}),
      },
    );
    updated += 1;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        scanned,
        updated,
        skippedMissingOrder,
      },
      null,
      2,
    ),
  );

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

