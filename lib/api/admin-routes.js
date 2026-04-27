import { apiError, apiErrorFrom, apiSuccess, parseJsonBody, zodErrorToFields } from "@/lib/api/response";
import { requireApiSession } from "@/lib/api/request";

export function createCollectionHandlers({ list, create, createSchema, entityLabel }) {
  return {
    async GET() {
      const { error, session } = await requireApiSession();
      if (error) {
        return error;
      }

      try {
        const data = await list(undefined, { session });
        return apiSuccess(data, `${entityLabel} loaded.`);
      } catch (handlerError) {
        return apiErrorFrom(handlerError, `Could not load ${entityLabel}.`);
      }
    },
    async POST(request) {
      const { error, session } = await requireApiSession();
      if (error) {
        return error;
      }

      try {
        const body = await parseJsonBody(request);
        const parsed = createSchema.safeParse(body);
        if (!parsed.success) {
          return apiError("Validation failed.", 400, { fields: zodErrorToFields(parsed.error) });
        }

        const result = await create(parsed.data, { session });
        return apiSuccess(result.data, result.message, 201);
      } catch (handlerError) {
        return apiErrorFrom(handlerError, `Could not create ${entityLabel}.`);
      }
    },
  };
}

export function createItemHandlers({ getOne, update, remove, updateSchema, entityLabel }) {
  const patchHandler = async (request, { params }) => {
    const { error, session } = await requireApiSession();
    if (error) {
      return error;
    }

    try {
      const { id } = await params;
      const body = await parseJsonBody(request);
      const parsed = updateSchema.safeParse(body);
      if (!parsed.success) {
        return apiError("Validation failed.", 400, { fields: zodErrorToFields(parsed.error) });
      }

      const result = await update(id, parsed.data, { session });
      return apiSuccess(result.data, result.message);
    } catch (handlerError) {
      return apiErrorFrom(handlerError, `Could not update ${entityLabel}.`);
    }
  };

  return {
    async GET(_request, { params }) {
      const { error, session } = await requireApiSession();
      if (error) {
        return error;
      }

      try {
        const { id } = await params;
        const data = await getOne(id, { session });
        return apiSuccess(data, `${entityLabel} loaded.`);
      } catch (handlerError) {
        return apiErrorFrom(handlerError, `Could not load ${entityLabel}.`, 404);
      }
    },
    PATCH: patchHandler,
    PUT: patchHandler,
    async DELETE(_request, { params }) {
      const { error, session } = await requireApiSession();
      if (error) {
        return error;
      }

      try {
        const { id } = await params;
        const result = await remove(id, { session });
        return apiSuccess(result.data, result.message);
      } catch (handlerError) {
        return apiErrorFrom(handlerError, `Could not delete ${entityLabel}.`);
      }
    },
  };
}
