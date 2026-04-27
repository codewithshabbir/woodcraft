function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string>;
  };
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function apiRequest<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const json: unknown = await response.json().catch(() => ({}));
  const payload: ApiEnvelope<T> = isObject(json) ? (json as ApiEnvelope<T>) : {};

  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error?.message || "Request failed.");
  }

  return payload.data as T;
}

export async function apiMutation<TResponse = unknown, TBody = unknown>(
  path: string,
  method: string,
  body: TBody,
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    method,
    body: JSON.stringify(body),
  });
}
