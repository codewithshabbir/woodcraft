import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
