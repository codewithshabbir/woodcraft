import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { getDashboardAnalytics } from "@/lib/server/admin-data";

function assertAdmin(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (role !== "admin") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

export const GET = withApiContext(async (request) => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    assertAdmin(session);
    const { searchParams } = new URL(request.url);
    const range = String(searchParams.get("range") || "").trim() || "6-months";
    const data = await getDashboardAnalytics(range, { session });
    return apiSuccess(data, "Dashboard analytics loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load dashboard analytics.");
  }
});
