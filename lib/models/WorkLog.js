import mongoose from "mongoose";

const WorkLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    userId: { type: String, required: true, trim: true, alias: "employeeId" },
    orderId: { type: String, required: true, trim: true },
    taskDescription: { type: String, default: "", trim: true, alias: "taskName" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    hoursWorked: { type: Number, required: true, min: 0.0000001 },
    workDate: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: String, default: "", trim: true },
    approvedAt: { type: Date, default: null },
    wage: { type: Number, default: 0, min: 0, alias: "wageCalculated" },
  },
  { timestamps: true },
);

export default mongoose.models.WorkLog || mongoose.model("WorkLog", WorkLogSchema);
