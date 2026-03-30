"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { StatusMessage } from "@/components/shared/status-message";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeleteDialog from "@/features/admin/components/shared/confirm-delete-dialog";
import PageHeader from "@/features/admin/components/shared/page-header";
import SearchInput from "@/features/admin/components/shared/search-input";
import StatCard from "@/features/admin/components/shared/stat-card";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { listOrders } from "@/services/admin/admin.service";
import { formatNumber } from "@/lib/format";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const loadOrders = useCallback(() => listOrders(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadOrders });

  const orders = useMemo(() => data ?? [], [data]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) =>
      `${order.customerName} ${order.id}`.toLowerCase().includes(query),
    );
  }, [orders, search]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingAmount = filteredOrders
      .filter((order) => order.paymentStatus !== "paid")
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = filteredOrders.filter((order) => order.status === "completed").length;

    return { totalOrders, totalRevenue, pendingAmount, completedOrders };
  }, [filteredOrders]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders"
        action={
          <Link href={ROUTES.orders.new}>
            <PrimaryButton className="p-5">
              <Plus className="h-4 w-4" />
              Create Order
            </PrimaryButton>
          </Link>
        }
      />

      {message ? <StatusMessage type="success" message={message} /> : null}

      {isLoading ? <LoadingState title="Loading orders..." /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Orders could not be loaded"
          description="The order registry is still powered by the mock service layer. Retry to restore the screen state."
          actionLabel="Retry"
          onAction={reload}
        />
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Orders" value={stats.totalOrders} icon={Package} color="text-primary" />
            <StatCard
              label="Revenue"
              value={`Rs. ${formatNumber(stats.totalRevenue)}`}
              icon={DollarSign}
              color="text-emerald-600"
            />
            <StatCard
              label="Pending"
              value={`Rs. ${formatNumber(stats.pendingAmount)}`}
              icon={Clock}
              color="text-amber-600"
            />
            <StatCard
              label="Completed"
              value={stats.completedOrders}
              icon={CheckCircle}
              color="text-sky-600"
            />
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by customer or order ID..."
                className="w-full max-w-md"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Overview of all active and completed orders</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              {filteredOrders.length === 0 ? (
                <EmptyState
                  title="No orders match this search"
                  description="Try a different customer name or order ID to see matching records."
                  className="min-h-[220px] rounded-none border-0"
                />
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[920px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                        <th className="p-4 text-[11px] font-bold uppercase">Order</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Customer</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Items</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Total</th>
                        <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
                        <th className="p-4 text-[11px] font-bold uppercase text-center">Payment</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Deadline</th>
                        <th className="p-4 text-right text-[11px] font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                          <td className="p-4 font-mono text-[12px] text-muted-foreground whitespace-nowrap">#{order.id}</td>
                          <td className="p-4 font-semibold text-primary whitespace-nowrap">{order.customerName}</td>
                          <td className="p-4 whitespace-nowrap">{order.itemsCount} items</td>
                          <td className="p-4 font-medium whitespace-nowrap">Rs. {formatNumber(order.totalAmount)}</td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-[11px] font-bold uppercase",
                                order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-slate-100 text-slate-700",
                              )}
                            >
                              {order.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-[11px] font-bold uppercase",
                                order.paymentStatus === "paid"
                                  ? "bg-primary text-primary-foreground"
                                  : order.paymentStatus === "partial"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700",
                              )}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap">{order.deadline}</td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <Link href={ROUTES.orders.detail(order.id)}>
                                <PrimaryButton size="sm" className="h-8 w-8 p-2">
                                  <Eye className="h-4 w-4" />
                                </PrimaryButton>
                              </Link>
                              <Link href={ROUTES.orders.edit(order.id)}>
                                <PrimaryButton size="sm" variant="secondary" className="h-8 w-8 p-2">
                                  <Pencil className="h-4 w-4" />
                                </PrimaryButton>
                              </Link>
                              <ConfirmDeleteDialog
                                itemId={order.id}
                                entityLabel="order"
                                entityType="order"
                                trigger={
                                  <PrimaryButton size="sm" variant="destructive" className="h-8 w-8 p-2">
                                    <Trash2 className="h-4 w-4" />
                                  </PrimaryButton>
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}