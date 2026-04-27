import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess, parseJsonBody, zodErrorToFields } from "@/lib/api/response";
import { createWorkLog, listWorkLogs } from "@/lib/server/admin-data";
import { z } from "zod";

const workLogCreateSchema = z.object({
  userId: z.string().trim().min(1).optional(),
  orderId: z.string().trim().min(1),
  taskDescription: z.string().optional().default(""),
  progress: z.coerce.number().min(0).max(100).optional().default(0),
  hoursWorked: z.coerce.number().gt(0),
  workDate: z.string().trim().min(1).refine((value) => !Number.isNaN(Date.parse(value)), "Invalid workDate"),
});

function isEmployeeSession(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  return role === "employee";
}

function assertAdminSession(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (role !== "admin") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

export const GET = withApiContext(async () => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    const data = await listWorkLogs(undefined, { session });
    return apiSuccess(data, "Work logs loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load work logs.");
  }
});

export const POST = withApiContext(async (request) => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    const body = await parseJsonBody(request);
    const parsed = workLogCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Invalid input", 400, { fields: zodErrorToFields(parsed.error) });
    }

    if (!isEmployeeSession(session) && !parsed.data.userId) {
      return apiError("Invalid input", 400, { fields: { userId: "Required" } });
    }

    if (!isEmployeeSession(session)) {
      assertAdminSession(session);
    }

    const result = await createWorkLog(
      {
        userId: parsed.data.userId || "",
        orderId: parsed.data.orderId,
        taskDescription: parsed.data.taskDescription,
        progress: parsed.data.progress,
        hoursWorked: parsed.data.hoursWorked,
        workDate: parsed.data.workDate,
        status: "pending",
      },
      { session },
    );

    return apiSuccess(result.data, result.message, 201);
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not record work log.");
  }
});
