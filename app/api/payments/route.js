import { createCollectionHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { createPayment, listPayments } from "@/lib/server/admin-data";
import { paymentSchema } from "@/lib/validations/entities";

const handlers = createCollectionHandlers({
  list: listPayments,
  create: createPayment,
  createSchema: paymentSchema,
  entityLabel: "Payments",
});

export const GET = withApiContext(handlers.GET);
export const POST = withApiContext(handlers.POST);
