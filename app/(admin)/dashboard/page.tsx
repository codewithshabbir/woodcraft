"use client";

import Link from "next/link";
import { useCallback } from "react";
import { DollarSign, Package, TriangleAlert, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import PageHeader from "@/components/shared/page-header";
import StatCard from "@/components/shared/stat-card";
import { ROUTES } from "@/lib/constants/routes";
import { formatNumber } from "@/lib/format";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { getDashboardSummary } from "@/services/dashboard/dashboard.service";

export default function DashboardPage() {
  const loadSummary = useCallback(() => getDashboardSummary(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadSummary });

  if (isLoading) return <LoadingState title="Loading dashboard..." />;
  if (error || !data) {
    return (
      <ErrorState
        title="Dashboard could not be loaded"
        description={error || "No dashboard data returned."}
        actionLabel="Retry"
        onAction={reload}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Operational snapshot (orders, inventory, revenue, expenses)."
        action={
          <Link href={ROUTES.orders.new}>
            <PrimaryButton className="p-5">Create Order</PrimaryButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Orders" value={data.stats.activeOrders} icon={Package} color="text-primary" />
        <StatCard label="Employees" value={data.stats.employees} icon={Users} color="text-sky-600" />
        <StatCard label="Revenue" value={`Rs. ${formatNumber(data.stats.totalRevenue)}`} icon={DollarSign} color="text-emerald-600" />
        <StatCard label="Low Stock" value={data.stats.lowQuantityAlerts} icon={TriangleAlert} color="text-amber-600" />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders and their current lifecycle status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                  <th className="p-4 text-[11px] font-bold uppercase">Order</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Customer</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Estimated</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Created</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      <Link className="text-primary hover:underline" href={ROUTES.orders.detail(order.id)}>
                        {order.id}
                      </Link>
                    </td>
                    <td className="p-4 text-muted-foreground">{order.customerId}</td>
                    <td className="p-4">Rs. {formatNumber(order.estimatedCost)}</td>
                    <td className="p-4 text-muted-foreground">{String(order.createdAt).slice(0, 10)}</td>
                    <td className="p-4">{order.status.replace("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Finance</CardTitle>
          <CardDescription>Revenue vs expenses summary.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">Rs. {formatNumber(data.stats.totalExpenses)}</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-sm text-muted-foreground">Outstanding Invoices</p>
            <p className="text-2xl font-bold">{data.stats.outstandingInvoices}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

