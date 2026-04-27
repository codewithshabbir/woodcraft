import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { getDashboardSummary } from "@/lib/server/admin-data";

function assertAdmin(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (role !== "admin") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

export const GET = withApiContext(async () => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    assertAdmin(session);
    const data = await getDashboardSummary(undefined, { session });
    return apiSuccess(data, "Dashboard summary loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load dashboard summary.");
  }
});
