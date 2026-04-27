import { createItemHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { deleteWorkLog, getWorkLog, updateWorkLog } from "@/lib/server/admin-data";
import { partialSchemas } from "@/lib/validations/entities";

const handlers = createItemHandlers({
  getOne: getWorkLog,
  update: updateWorkLog,
  remove: deleteWorkLog,
  updateSchema: partialSchemas.workLog,
  entityLabel: "Work log",
});

export const GET = withApiContext(handlers.GET);
export const PATCH = withApiContext(handlers.PATCH);
export const PUT = withApiContext(handlers.PUT);
export const DELETE = withApiContext(handlers.DELETE);
