import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();
const extensionsToTry = [".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json"];

function resolvePathWithExtensions(candidatePath) {
  if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
    return candidatePath;
  }

  if (!path.extname(candidatePath)) {
    for (const ext of extensionsToTry) {
      const nextPath = `${candidatePath}${ext}`;
      if (fs.existsSync(nextPath) && fs.statSync(nextPath).isFile()) {
        return nextPath;
      }
    }
  }

  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const relative = specifier.slice(2).replaceAll("/", path.sep);
    const candidate = path.join(repoRoot, relative);
    const resolved = resolvePathWithExtensions(candidate);
    if (!resolved) {
      throw new Error(`Could not resolve path alias ${specifier}`);
    }
    return { url: pathToFileURL(resolved).href, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}

