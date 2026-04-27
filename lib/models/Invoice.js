import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    orderId: { type: String, required: true, unique: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    generatedDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ["Unpaid", "Partial", "Paid"], default: "Unpaid" },
    totalPaid: { type: Number, required: true, min: 0, default: 0 },
    remainingBalance: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
