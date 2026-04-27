/* eslint-disable @typescript-eslint/no-require-imports */
const { startServer } = require("next/dist/server/lib/start-server");
const { loadEnvConfig } = require("@next/env");

function readArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return undefined;
}

async function main() {
  loadEnvConfig(process.cwd(), true);

  process.env.AUTH_URL ??= process.env.NEXTAUTH_URL;
  process.env.NEXTAUTH_URL ??= process.env.AUTH_URL;
  process.env.AUTH_SECRET ??= process.env.NEXTAUTH_SECRET;
  process.env.NEXTAUTH_SECRET ??= process.env.AUTH_SECRET;

  const portRaw = readArgValue("--port") ?? readArgValue("-p") ?? process.env.PORT ?? "3000";
  const hostRaw = readArgValue("--hostname") ?? readArgValue("-H") ?? process.env.HOSTNAME ?? "localhost";

  const port = Number.parseInt(String(portRaw), 10);
  const hostname = String(hostRaw);

  await startServer({
    dir: process.cwd(),
    port: Number.isFinite(port) ? port : 3000,
    allowRetry: true,
    isDev: true,
    hostname,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
