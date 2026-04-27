import { createCollectionHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { createEmployee, listEmployees } from "@/lib/server/admin-data";
import { employeeSchema } from "@/lib/validations/entities";

const handlers = createCollectionHandlers({
  list: listEmployees,
  create: createEmployee,
  createSchema: employeeSchema,
  entityLabel: "Employees",
});

export const GET = withApiContext(handlers.GET);
export const POST = withApiContext(handlers.POST);

