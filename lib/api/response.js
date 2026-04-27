import { NextResponse } from "next/server";
import { logApiResult } from "@/lib/api/observability";

export function apiSuccess(data, _message = "OK", status = 200) {
  logApiResult({ outcome: "success", status });
  return NextResponse.json({ ok: true, data, message: _message }, { status });
}

export function apiError(message, status = 500, details) {
  logApiResult({ outcome: "fail", status });
  const normalizedDetails = details && typeof details === "object" ? details : {};
  const inferredCode =
    status === 400 || status === 409 || status === 422 ? "VALIDATION_ERROR"
    : status === 401 ? "UNAUTHORIZED"
    : status === 403 ? "FORBIDDEN"
    : status === 404 ? "NOT_FOUND"
    : "INTERNAL_ERROR";
  const inferredMessage =
    status === 400 || status === 409 || status === 422 ? "Invalid input"
    : status === 401 ? "Unauthorized"
    : status === 403 ? "Forbidden"
    : status === 404 ? "Resource not found"
    : "Unexpected error";

  const code =
    typeof normalizedDetails.code === "string" && normalizedDetails.code.trim()
      ? normalizedDetails.code.trim()
      : inferredCode;

  const resolvedMessage =
    typeof normalizedDetails.message === "string" && normalizedDetails.message.trim()
      ? normalizedDetails.message.trim()
      : typeof message === "string" && message.trim()
        ? message.trim()
        : inferredMessage;

  const fields =
    normalizedDetails.fields && typeof normalizedDetails.fields === "object"
      ? normalizedDetails.fields
      : {};
  return NextResponse.json(
    { ok: false, error: { code, message: resolvedMessage, fields } },
    { status },
  );
}

export async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON payload.");
  }
}

export function unwrapZodError(error) {
  return error?.issues?.[0]?.message || "Validation failed.";
}

export function zodErrorToFields(error) {
  const fields = {};
  const issues = Array.isArray(error?.issues) ? error.issues : [];
  for (const issue of issues) {
    const path = Array.isArray(issue?.path) && issue.path.length > 0 ? issue.path.join(".") : "root";
    if (typeof fields[path] === "string") continue;
    fields[path] = typeof issue?.message === "string" && issue.message.trim() ? issue.message : "Invalid";
  }
  return fields;
}

export function inferErrorStatus(error, fallbackStatus = 500) {
  if (typeof error?.status === "number") {
    return error.status;
  }

  const message = error instanceof Error ? error.message : "";

  if (/unauthorized/i.test(message)) {
    return 401;
  }

  if (/not allowed|forbidden|only .* can|cannot|can't/i.test(message)) {
    return 403;
  }

  if (/not found/i.test(message)) {
    return 404;
  }

  if (/validation|required|invalid|already|overpayment|insufficient|must|unsupported|blocked/i.test(message)) {
    return 400;
  }

  return fallbackStatus;
}

export function apiErrorFrom(error, fallbackMessage, fallbackStatus = 500) {
  return apiError(
    error instanceof Error ? error.message : fallbackMessage,
    inferErrorStatus(error, fallbackStatus),
    error?.details,
  );
}
