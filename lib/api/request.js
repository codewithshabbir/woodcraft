import { auth } from "@/lib/auth";
import { apiError } from "@/lib/api/response";
import { logApiAuth } from "@/lib/api/observability";

export async function requireApiSession() {
  const session = await auth();

  if (!session?.user?.email) {
    logApiAuth({ outcome: "fail", status: 401 });
    return { error: apiError("Unauthorized.", 401) };
  }

  return { session };
}
