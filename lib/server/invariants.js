function isStrictMode() {
  return process.env.INVARIANTS_MODE === "strict" || process.env.INVARIANTS_STRICT === "1";
}

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function invariantMode() {
  return isStrictMode() ? "strict" : "safe";
}

export function checkInvariant(ok, { code, message, details } = {}) {
  if (ok) return;

  const payload = {
    code: code || "invariant.violation",
    message: message || "Invariant violated.",
    mode: invariantMode(),
    ...(details ? { details } : {}),
  };

  if (isStrictMode()) {
    const error = new Error(payload.message);
    error.status = 400;
    error.details = payload;
    throw error;
  }

  console.warn("[invariant]", payload);
}

export function checkNonNegative(value, context) {
  const numeric = toNumber(value);
  checkInvariant(numeric >= 0, {
    code: context?.code,
    message: context?.message,
    details: { ...context?.details, value: numeric },
  });
}

