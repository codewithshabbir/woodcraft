import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin", enum: ["admin", "employee"] },
    employeeType: { type: String, default: "", trim: true, alias: "skillType" },
    hourlyRate: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
