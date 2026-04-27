import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import OrderForm from "@/features/orders/order-form";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ROUTES } from "@/lib/constants/routes";
import { getOrder } from "@/lib/server/admin-data";
import { auth } from "@/lib/auth";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const order = await getOrder(id, { session });

  const toDateInput = (value: unknown) => {
    if (!value) return "";
    const parsed = new Date(value as string);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
  };

  const initialData = {
    customerId: order.customerId,
    description: order.description || "",
    status: order.status,
    startDate: toDateInput(order.startDate),
    endDate: toDateInput(order.endDate),
    materialsUsed: (order.materialsUsed || []).map((item: { materialId: string; quantityUsed: number }) => ({
      materialId: item.materialId,
      quantityUsed: Number(item.quantityUsed || 0),
    })),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Edit Order #{id}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update order details and material usage
          </p>
        </div>
        <Link href={ROUTES.orders.root}>
          <PrimaryButton
            variant="outline"
            className="border-primary p-5 hover:border-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </PrimaryButton>
        </Link>
      </div>

      <OrderForm mode="edit" orderId={id} initialData={initialData} />
    </div>
  );
}
