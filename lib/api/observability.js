import { AsyncLocalStorage } from "node:async_hooks";

const apiContextStorage = new AsyncLocalStorage();

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

function extractEntityId(params) {
  if (!params || typeof params !== "object") return undefined;

  if (typeof params.id === "string" && params.id.trim()) return params.id.trim();

  const keys = Object.keys(params);
  if (keys.length === 1) {
    const value = params[keys[0]];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return undefined;
}

function sanitizeEntityId(entityId) {
  if (typeof entityId !== "string") return undefined;
  const trimmed = entityId.trim();
  if (!trimmed) return undefined;
  return trimmed.length > 80 ? trimmed.slice(0, 80) : trimmed;
}

function safePathname(request) {
  try {
    return new URL(request.url).pathname;
  } catch {
    return "";
  }
}

export function runWithApiContext({ request, params } = {}, fn) {
  if (!request || typeof fn !== "function") {
    return typeof fn === "function" ? fn() : undefined;
  }

  const context = {
    route: safePathname(request),
    method: request.method,
    entityId: sanitizeEntityId(extractEntityId(params)),
    startedAt: Date.now(),
  };

  return apiContextStorage.run(context, fn);
}

export function withApiContext(handler) {
  return function apiHandlerWithContext(request, routeContext) {
    return runWithApiContext({ request, params: routeContext?.params }, () => handler(request, routeContext));
  };
}

export function getApiContext() {
  return apiContextStorage.getStore() || {};
}

export function logApiResult({ outcome, status, entityId } = {}) {
  if (!isDevelopment()) return;

  const context = getApiContext();
  const route = context.route || "";
  const method = context.method || "";
  const resolvedEntityId = sanitizeEntityId(entityId) || context.entityId;

  const payload = {
    route,
    method,
    outcome,
    status,
    ...(resolvedEntityId ? { entityId: resolvedEntityId } : {}),
    ...(typeof context.startedAt === "number" ? { durationMs: Date.now() - context.startedAt } : {}),
  };

  const label = `[api] ${method} ${route}`.trim();
  if (outcome === "fail") {
    console.warn(label, payload);
  } else {
    console.info(label, payload);
  }
}

export function logApiAuth({ outcome, status } = {}) {
  if (!isDevelopment()) return;
  const context = getApiContext();
  const payload = {
    route: context.route || "",
    method: context.method || "",
    outcome,
    status,
  };
  console.warn("[api.auth]", payload);
}

