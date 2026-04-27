import { createCollectionHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { createExpense, listExpenses } from "@/lib/server/admin-data";
import { expenseSchema } from "@/lib/validations/entities";

const handlers = createCollectionHandlers({
  list: listExpenses,
  create: createExpense,
  createSchema: expenseSchema,
  entityLabel: "Expenses",
});

export const GET = withApiContext(handlers.GET);
export const POST = withApiContext(handlers.POST);

