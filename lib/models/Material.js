import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    supplierId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    pricePerUnit: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    threshold: { type: Number, default: 0, min: 0 },
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.models.Material || mongoose.model("Material", MaterialSchema);
