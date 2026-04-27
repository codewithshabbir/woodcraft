import { withApiContext } from "@/lib/api/observability";
import { requireApiSession } from "@/lib/api/request";
import { apiErrorFrom, apiSuccess } from "@/lib/api/response";
import { connectToDatabase } from "@/lib/mongodb";
import Material from "@/lib/models/Material";
import { ROUTES } from "@/lib/constants/routes";

function assertAdmin(session) {
  const role = typeof session?.user?.role === "string" ? session.user.role.trim().toLowerCase() : "";
  if (role !== "admin") {
    const error = new Error("Forbidden.");
    error.status = 403;
    throw error;
  }
}

function toCreatedAtLabel(date) {
  if (!(date instanceof Date)) return "Today";
  const diffDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export const GET = withApiContext(async () => {
  const { error, session } = await requireApiSession();
  if (error) return error;

  try {
    assertAdmin(session);
    await connectToDatabase();

    const materials = await Material.find()
      .select("id name unit quantity threshold updatedAt")
      .sort({ quantity: 1, updatedAt: -1 })
      .lean();

    const items = (materials || [])
      .filter((mat) => Number(mat.threshold || 0) > 0 && Number(mat.quantity || 0) < Number(mat.threshold || 0))
      .slice(0, 10)
      .map((mat) => {
        const threshold = Number(mat.threshold || 0);
        const quantity = Number(mat.quantity || 0);
        const severity = quantity <= threshold * 0.5 ? "critical" : "warning";
        return {
          id: `low-${mat.id}`,
          type: "low_quantity",
          title: `Low stock: ${mat.name}`,
          description: `${quantity} ${mat.unit} remaining (threshold ${threshold}).`,
          href: ROUTES.inventory.quantityLevels,
          read: false,
          severity,
          createdAtLabel: toCreatedAtLabel(mat.updatedAt),
        };
      });

    return apiSuccess(items, "Notifications loaded.");
  } catch (handlerError) {
    return apiErrorFrom(handlerError, "Could not load notifications.");
  }
});
