import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    location: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);
