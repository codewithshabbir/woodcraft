import { createItemHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { deleteCustomer, getCustomer, updateCustomer } from "@/lib/server/admin-data";
import { partialSchemas } from "@/lib/validations/entities";

const handlers = createItemHandlers({
  getOne: getCustomer,
  update: updateCustomer,
  remove: deleteCustomer,
  updateSchema: partialSchemas.customer,
  entityLabel: "Customer",
});

export const GET = withApiContext(handlers.GET);
export const PATCH = withApiContext(handlers.PATCH);
export const PUT = withApiContext(handlers.PUT);
export const DELETE = withApiContext(handlers.DELETE);
