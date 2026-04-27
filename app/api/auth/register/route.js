import { apiError } from "@/lib/api/response";
import { withApiContext } from "@/lib/api/observability";

async function postRegister(request) {
  void request;
  return apiError("Public registration is disabled. Use the seeded admin account or contact the administrator.", 403);
}

export const POST = withApiContext(postRegister);
