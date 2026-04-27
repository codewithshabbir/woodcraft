import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    invoiceId: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paymentDate: { type: String, required: true, trim: true },
  },
  { timestamps: false },
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
