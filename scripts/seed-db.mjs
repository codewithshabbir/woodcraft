import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment / .env.local");
  }

  const { connectToDatabase } = await import("@/lib/mongodb");
  const { ensureBootstrapped } = await import("@/lib/server/bootstrap");

  await connectToDatabase();
  await ensureBootstrapped();

  const users = await mongoose.connection.db
    .collection("users")
    .find({}, { projection: { _id: 0, id: 1, email: 1, role: 1 } })
    .toArray();

  // Minimal confirmation
  // eslint-disable-next-line no-console
  console.log("[seed] Bootstrapped OK. Users:", users);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[seed] FAILED", err?.message || err);
  process.exitCode = 1;
});
