import { createCollectionHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { createSupplier, listSuppliers } from "@/lib/server/admin-data";
import { supplierSchema } from "@/lib/validations/entities";

const handlers = createCollectionHandlers({
  list: listSuppliers,
  create: createSupplier,
  createSchema: supplierSchema,
  entityLabel: "Suppliers",
});

export const GET = withApiContext(handlers.GET);
export const POST = withApiContext(handlers.POST);
