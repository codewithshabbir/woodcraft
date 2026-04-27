import { handlers } from "@/lib/auth";
import { withApiContext } from "@/lib/api/observability";

export const GET = withApiContext(handlers.GET);
export const POST = withApiContext(handlers.POST);
