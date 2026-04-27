import { createItemHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { deleteSupplier, getSupplier, updateSupplier } from "@/lib/server/admin-data";
import { partialSchemas } from "@/lib/validations/entities";

const handlers = createItemHandlers({
  getOne: getSupplier,
  update: updateSupplier,
  remove: deleteSupplier,
  updateSchema: partialSchemas.supplier,
  entityLabel: "Supplier",
});

export const GET = withApiContext(handlers.GET);
export const PATCH = withApiContext(handlers.PATCH);
export const PUT = withApiContext(handlers.PUT);
export const DELETE = withApiContext(handlers.DELETE);
