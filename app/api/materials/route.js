import { createCollectionHandlers } from "@/lib/api/admin-routes";
import { withApiContext } from "@/lib/api/observability";
import { createRawMaterial, listRawMaterials } from "@/lib/server/admin-data";
import { materialSchema } from "@/lib/validations/entities";

const handlers = createCollectionHandlers({
  list: listRawMaterials,
  create: createRawMaterial,
  createSchema: materialSchema,
  entityLabel: "Materials",
});

export const GET = withApiContext(handlers.GET);
export const POST = withApiContext(handlers.POST);
