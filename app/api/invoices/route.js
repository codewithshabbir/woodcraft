import { createCollectionHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { createInvoice, listInvoices } from "@/lib/server/admin-data";
import { invoiceSchema } from "@/lib/validations/entities";

const handlers = createCollectionHandlers({
  list: listInvoices,
  create: createInvoice,
  createSchema: invoiceSchema,
  entityLabel: "Invoice",
});

export const GET = withApiContext(handlers.GET);
export const POST = withApiContext(handlers.POST);
