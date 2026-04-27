import { createItemHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { deleteInvoice, getInvoice, updateInvoice } from "@/lib/server/admin-data";
import { partialSchemas } from "@/lib/validations/entities";

const handlers = createItemHandlers({
  getOne: getInvoice,
  update: updateInvoice,
  remove: deleteInvoice,
  updateSchema: partialSchemas.invoice,
  entityLabel: "Invoice",
});

export const GET = withApiContext(handlers.GET);
export const PATCH = withApiContext(handlers.PATCH);
export const PUT = withApiContext(handlers.PUT);
export const DELETE = withApiContext(handlers.DELETE);
