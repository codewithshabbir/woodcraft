import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    notes: { type: String, default: "", trim: true },
    orderId: { type: String, default: "", trim: true },
    materialId: { type: String, default: "", trim: true },
    userId: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
