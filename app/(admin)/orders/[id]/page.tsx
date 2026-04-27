import Link from "next/link";
import { ClipboardList, Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import InfoPair from "@/components/shared/info-pair";
import PageHeader from "@/components/shared/page-header";
import StatusBadge from "@/components/shared/status-badge";
import { ROUTES } from "@/lib/constants/routes";
import { formatNumber } from "@/lib/format";
import { getOrder } from "@/lib/server/admin-data";
import OrderAssignmentPanel from "@/features/orders/order-assignment-panel";
import EmployeeProgressPanel from "@/features/orders/employee-progress-panel";
import { auth } from "@/lib/auth";
import type { OrderRecord } from "@/types/entities/admin";

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const isAdmin = String(session?.user?.role || "").toLowerCase() === "admin";
  const order = (await getOrder(id, { session })) as OrderRecord & { assignedEmployeeIds?: string[] };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader title="Order Details" description={order.id} backHref={ROUTES.orders.root} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Estimated Cost" value={`Rs. ${formatNumber(order.estimatedCost)}`} icon={Package} />
        <Metric label="Materials" value={`${order.materialsUsed?.length || 0}`} icon={ClipboardList} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <InfoPair label="Customer ID" value={order.customerId} />
              <InfoPair label="Estimated Cost" value={`Rs. ${formatNumber(order.estimatedCost)}`} />
              <InfoPair
                label="Status"
                value={
                  <StatusBadge
                    label={order.status.replace("_", " ")}
                    toneClassName={
                      order.status === "delivered"
                        ? "bg-sky-100 text-sky-700"
                        : order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-700"
                    }
                  />
                }
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {order.description || "No description provided."}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Materials Used</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(order.materialsUsed || []).map((material: NonNullable<OrderRecord["materialsUsed"]>[number], index: number) => (
                <div key={`${material.materialId}-${index}`} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{material.name || material.materialId}</span>
                  <span className="text-muted-foreground">{material.quantityUsed}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <OrderAssignmentPanel orderId={order.id} assignedEmployeeIds={order.assignedEmployeeIds || []} />
          <EmployeeProgressPanel orderId={order.id} currentStatus={order.status} />
          {isAdmin ? (
            <Link href={ROUTES.orders.edit(order.id)}>
              <PrimaryButton className="w-full p-5">Edit Order</PrimaryButton>
            </Link>
          ) : null}
          {isAdmin ? (
            <Link href={ROUTES.billing.invoices.root}>
              <PrimaryButton variant="outline" className="w-full border-primary p-5 hover:border-primary">
                View Invoices
              </PrimaryButton>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Package;
}) {
  return (
    <Card className="rounded-xl border border-border shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
          <h2 className="mt-1 text-2xl font-bold text-primary">{value}</h2>
        </div>
        <Icon className="h-8 w-8 text-primary/20" />
      </CardContent>
    </Card>
  );
}
