import mongoose from "mongoose";

const StockLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    materialId: { type: String, required: true, trim: true },
    orderId: { type: String, default: "", trim: true },
    quantityChanged: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ["IN", "OUT"] },
    performedByUserId: { type: String, default: "", trim: true },
    date: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true },
);

export default mongoose.models.StockLog || mongoose.model("StockLog", StockLogSchema);
