import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiError, apiErrorFrom, apiSuccess, parseJsonBody, zodErrorToFields } from "@/lib/api/response";
import { connectToDatabase } from "@/lib/mongodb";
import Material from "@/lib/models/Material";
import User from "@/lib/models/User";
import { z } from "zod";

function assertAdmin(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (role !== "admin") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

const schema = z.object({
  materialsUsed: z
    .array(
      z.object({
        materialId: z.string().trim().min(1),
        quantityUsed: z.coerce.number().gt(0),
      }),
    )
    .min(1),
  labor: z
    .array(
      z.object({
        employeeId: z.string().trim().min(1),
        hours: z.coerce.number().gt(0),
      }),
    )
    .optional()
    .default([]),
});

export const POST = withApiContext(async (request) => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    assertAdmin(session);

    const body = await parseJsonBody(request);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError("Invalid input", 400, { fields: zodErrorToFields(parsed.error) });
    }

    await connectToDatabase();

    const requestedMaterials = parsed.data.materialsUsed.reduce((acc, row) => {
      acc[row.materialId] = (acc[row.materialId] || 0) + Number(row.quantityUsed || 0);
      return acc;
    }, {});

    const materialIds = Object.keys(requestedMaterials);
    const materials = await Material.find({ id: { $in: materialIds } })
      .select("id name pricePerUnit")
      .lean();
    const materialMap = new Map(materials.map((m) => [m.id, m]));

    const missingMaterial = materialIds.find((id) => !materialMap.has(id));
    if (missingMaterial) {
      return apiError("Invalid input", 400, { fields: { materialsUsed: `Material ${missingMaterial} not found` } });
    }

    const materialBreakdown = materialIds.map((materialId) => {
      const material = materialMap.get(materialId);
      const quantityUsed = Number(requestedMaterials[materialId] || 0);
      const unitPrice = Number(material.pricePerUnit || 0);
      return {
        materialId,
        name: material.name,
        quantityUsed,
        unitPrice,
        lineTotal: quantityUsed * unitPrice,
      };
    });

    const materialCost = materialBreakdown.reduce((sum, row) => sum + row.lineTotal, 0);

    const requestedLabor = parsed.data.labor.reduce((acc, row) => {
      acc[row.employeeId] = (acc[row.employeeId] || 0) + Number(row.hours || 0);
      return acc;
    }, {});
    const employeeIds = Object.keys(requestedLabor);

    const employees = employeeIds.length
      ? await User.find({ id: { $in: employeeIds }, role: "employee" }).select("id name hourlyRate").lean()
      : [];
    const employeeMap = new Map(employees.map((e) => [e.id, e]));

    const missingEmployee = employeeIds.find((id) => !employeeMap.has(id));
    if (missingEmployee) {
      return apiError("Invalid input", 400, { fields: { labor: `Employee ${missingEmployee} not found` } });
    }

    const laborBreakdown = employeeIds.map((employeeId) => {
      const employee = employeeMap.get(employeeId);
      const hours = Number(requestedLabor[employeeId] || 0);
      const hourlyRate = Number(employee.hourlyRate || 0);
      return {
        employeeId,
        name: employee.name,
        hours,
        hourlyRate,
        lineTotal: hours * hourlyRate,
      };
    });

    const laborCost = laborBreakdown.reduce((sum, row) => sum + row.lineTotal, 0);

    return apiSuccess(
      {
        materialCost,
        laborCost,
        totalCost: materialCost + laborCost,
        materialBreakdown,
        laborBreakdown,
      },
      "Estimation calculated.",
    );
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not calculate estimation.");
  }
});

