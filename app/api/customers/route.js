import { createCollectionHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { createCustomer, listCustomers } from "@/lib/server/admin-data";
import { customerSchema } from "@/lib/validations/entities";

const handlers = createCollectionHandlers({
  list: listCustomers,
  create: createCustomer,
  createSchema: customerSchema,
  entityLabel: "Customers",
});

export const GET = withApiContext(handlers.GET);
export const POST = withApiContext(handlers.POST);
