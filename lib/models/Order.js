import mongoose from "mongoose";

const MaterialUsageSchema = new mongoose.Schema(
  {
    materialId: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    quantityUsed: { type: Number, required: true, min: 0.0000001 },
    priceAtTime: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    customerId: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ["pending", "in_progress", "completed", "delivered"] },
    estimatedCost: { type: Number, required: true, min: 0 },
    actualCost: { type: Number, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    assignedEmployeeIds: { type: [String], default: [] },
    materialsUsed: {
      type: [MaterialUsageSchema],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "materialsUsed cannot be empty",
      },
    },
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
