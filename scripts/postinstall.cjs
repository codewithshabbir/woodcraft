/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

function patchFile(filePath, { marker, apply }) {
  if (!fs.existsSync(filePath)) return { ok: false, reason: "missing" };
  const original = fs.readFileSync(filePath, "utf8");
  if (original.includes(marker)) return { ok: true, changed: false };
  const updated = apply(original);
  if (updated === original) return { ok: false, reason: "no-op" };
  fs.writeFileSync(filePath, updated, "utf8");
  return { ok: true, changed: true };
}

function main() {
  const projectRoot = process.cwd();

  const buildIndexPath = path.join(
    projectRoot,
    "node_modules",
    "next",
    "dist",
    "build",
    "index.js",
  );
  const exportIndexPath = path.join(
    projectRoot,
    "node_modules",
    "next",
    "dist",
    "export",
    "index.js",
  );

  const buildPatch = patchFile(buildIndexPath, {
    marker: "config.generateBuildId = undefined;",
    apply: (text) => {
      const needle = "_buildcontext.NextBuildContext.buildId = buildId;";
      const idx = text.indexOf(needle);
      if (idx === -1) return text;
      const insertAt = idx + needle.length;
      const patch =
        "\n            // When `experimental.workerThreads` is enabled, Next.js uses structured cloning to pass\n" +
        "            // `nextConfig` to worker threads. Functions are not cloneable, but `generateBuildId` is\n" +
        "            // only needed to compute `buildId` above, so we clear it to avoid DataCloneError.\n" +
        "            config.generateBuildId = undefined;";
      return text.slice(0, insertAt) + patch + text.slice(insertAt);
    },
  });

  const exportPatch = patchFile(exportIndexPath, {
    marker: "nextConfig.exportPathMap = undefined;",
    apply: (text) => {
      const needle = "const exportPathMap = await span.traceChild('run-export-path-map').traceAsyncFn(async ()=>{";
      const start = text.indexOf(needle);
      if (start === -1) return text;

      const afterExportPathMap = text.indexOf("});\n    // During static export", start);
      if (afterExportPathMap === -1) return text;

      const patch =
        "    // When `experimental.workerThreads` is enabled, Next.js uses structured cloning to pass\n" +
        "    // `nextConfig` to export workers. `exportPathMap` is a function (not cloneable), and is\n" +
        "    // only needed to compute `exportPathMap` above, so clear it to avoid DataCloneError.\n" +
        "    nextConfig.exportPathMap = undefined;\n";

      return text.slice(0, afterExportPathMap + 3) + patch + text.slice(afterExportPathMap + 3);
    },
  });

  if (!buildPatch.ok || !exportPatch.ok) {
    const details = [];
    if (!buildPatch.ok) details.push(`build index patch: ${buildPatch.reason}`);
    if (!exportPatch.ok) details.push(`export index patch: ${exportPatch.reason}`);
    throw new Error(`postinstall patch failed: ${details.join(", ")}`);
  }

  if (buildPatch.changed || exportPatch.changed) {
    // eslint-disable-next-line no-console
    console.log(
      `[postinstall] Patched Next.js for Windows/sandbox workerThreads compatibility (${[
        buildPatch.changed ? "build" : null,
        exportPatch.changed ? "export" : null,
      ]
        .filter(Boolean)
        .join(", ")})`,
    );
  }
}

main();
