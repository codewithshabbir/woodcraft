import { createItemHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { deletePayment, getPayment, updatePayment } from "@/lib/server/admin-data";
import { partialSchemas } from "@/lib/validations/entities";

const handlers = createItemHandlers({
  getOne: getPayment,
  update: updatePayment,
  remove: deletePayment,
  updateSchema: partialSchemas.payment,
  entityLabel: "Payment",
});

export const GET = withApiContext(handlers.GET);
export const PATCH = withApiContext(handlers.PATCH);
export const PUT = withApiContext(handlers.PUT);
export const DELETE = withApiContext(handlers.DELETE);
