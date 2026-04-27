/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */

try {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: ".env.local" });
} catch {}

const dns = require("node:dns").promises;
const mongoose = require("mongoose");

function maskUri(uri) {
  try {
    const u = new URL(uri);
    if (u.password) u.password = "****";
    return u.toString();
  } catch {
    return "<invalid-uri>";
  }
}

function hintForError(error) {
  const msg = String(error?.message || "");
  const code = String(error?.code || "");

  if (code === "ETIMEOUT" && /_mongodb\._tcp\./i.test(msg)) {
    return [
      "DNS SRV lookup timeout (mongodb+srv).",
      "Fix:",
      "- Try different network / hotspot, or change DNS to 8.8.8.8 / 1.1.1.1",
      "- Or use a non-SRV URI (mongodb://host1,host2,host3/?replicaSet=...) from Atlas",
    ].join("\n");
  }

  if (/not authorized|IP address .* is not allowed|not in the access list/i.test(msg)) {
    return [
      "Atlas Network Access issue (IP not whitelisted).",
      "Fix: Atlas -> Network Access -> add your current IP (or temporarily 0.0.0.0/0 for testing).",
    ].join("\n");
  }

  if (/Authentication failed|bad auth|auth failed/i.test(msg)) {
    return [
      "MongoDB auth failed (username/password).",
      "Fix:",
      "- Atlas -> Database Access -> confirm user exists + password",
      "- If password has special chars (@ : / ? # &), URL-encode it in the URI",
    ].join("\n");
  }

  if (/ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(msg) || code === "ENOTFOUND") {
    return [
      "DNS/host resolution issue.",
      "Fix: check internet, DNS settings, or corporate firewall/VPN.",
    ].join("\n");
  }

  if (/ECONNREFUSED|connect ECONNREFUSED/i.test(msg)) {
    return [
      "Connection refused.",
      "Fix: if local MongoDB, ensure `mongod` is running; if Atlas, check firewall/VPN/port blocks.",
    ].join("\n");
  }

  return "No specific hint. Paste the full error output for targeted diagnosis.";
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI (check `.env.local`).");
    process.exitCode = 1;
    return;
  }

  console.log("[check:mongo] MONGODB_URI:", maskUri(uri));

  // DNS SRV check for mongodb+srv
  if (/^mongodb\+srv:\/\//i.test(uri)) {
    try {
      const u = new URL(uri);
      const host = u.hostname;
      console.log("[check:mongo] SRV host:", host);
      const srvName = `_mongodb._tcp.${host}`;
      const srv = await dns.resolveSrv(srvName);
      console.log("[check:mongo] SRV records:", srv);
    } catch (error) {
      console.error("[check:mongo] SRV resolve failed:", error?.message || error);
      console.error(hintForError(error));
      process.exitCode = 1;
      return;
    }
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      dbName: process.env.MONGODB_DB_NAME || "woodcraft",
    });
    console.log("[check:mongo] Connected OK.");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(
      "[check:mongo] Collections:",
      collections.map((c) => c.name).sort(),
    );
  } catch (error) {
    console.error("[check:mongo] Connect failed:", error?.message || error);
    console.error(hintForError(error));
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (err) {
      console.error("[check-mongo] mongoose.disconnect failed", err);
    }
  }
}

main();
