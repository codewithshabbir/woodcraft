import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    value: { type: Number, required: true, default: 0, min: 0 },
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

