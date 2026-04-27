"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClipboardList, RefreshCw, Save, Search } from "lucide-react";

import PageHeader from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/helpers";
import { listOrders } from "@/services/admin/admin.service";
import { getProfile } from "@/services/auth/profile.service";

const allowedStatuses = ["pending", "in_progress", "completed"] as const;
type AllowedStatus = (typeof allowedStatuses)[number];

function WorkProgressPageContent() {
  const [search, setSearch] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savingByOrderId, setSavingByOrderId] = useState<Record<string, boolean>>({});
  const [statusByOrderId, setStatusByOrderId] = useState<Record<string, AllowedStatus>>({});

  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const loadOrders = useCallback(() => listOrders(), []);
  const loadProfile = useCallback(() => getProfile(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadOrders });
  const { data: profile } = useAsyncResource({ loader: loadProfile });

  const orders = useMemo(() => (data ?? []).filter((o) => o.status !== "delivered"), [data]);
  const isEmployee = profile?.role === "employee";

  useEffect(() => {
    const next: Record<string, AllowedStatus> = {};
    for (const order of orders) {
      const current = String(order.status || "pending");
      next[order.id] = (allowedStatuses.includes(current as AllowedStatus) ? current : "pending") as AllowedStatus;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatusByOrderId(next);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) => `${order.customerId} ${order.description} ${order.id}`.toLowerCase().includes(query));
  }, [orders, search]);

  const save = async (orderId: string) => {
    setSubmitError(null);
    setSavingByOrderId((prev) => ({ ...prev, [orderId]: true }));
    try {
      const status = statusByOrderId[orderId];
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error?.message || json?.message || "Failed to update progress.");
      }
      await reload();
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Failed to update progress.");
    } finally {
      setSavingByOrderId((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (isLoading) return <LoadingState title="Loading assigned tasks..." />;
  if (!isLoading && error) {
    return (
      <ErrorState title="Work progress could not be loaded" description={error} actionLabel="Retry" onAction={reload} />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Work Progress"
        description="Update the status of your assigned tasks (UC11)"
        action={
          <Link href={ROUTES.orders.root}>
            <PrimaryButton variant="outline" className="p-5">
              <ClipboardList className="h-4 w-4" />
              View Assigned Tasks
            </PrimaryButton>
          </Link>
        }
      />

      {message ? <StatusMessage type="success" message={message} /> : null}
      {submitError ? <StatusMessage type="error" message={submitError} /> : null}

      {!isEmployee ? (
        <StatusMessage type="error" message="This page is only available for employees." />
      ) : null}

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center w-full max-w-md">
            <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-muted px-3 focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by customer, description, or order ID..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Assigned Tasks</CardTitle>
          <CardDescription>Only orders assigned to you are shown here.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <EmptyState
              title="No assigned tasks found"
              description="Once an admin assigns you to an order, it will appear here."
              className="min-h-[220px] rounded-none border-0"
            />
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="p-4 text-[11px] font-bold uppercase">Order</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Customer</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Description</th>
                    <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
                    <th className="p-4 text-right text-[11px] font-bold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const current = statusByOrderId[order.id] ?? "pending";
                    const saving = Boolean(savingByOrderId[order.id]);
                    const statusLabel = String(order.status || "").replace("_", " ");
                    return (
                      <tr key={order.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                        <td className="p-4 font-mono text-[12px] text-muted-foreground whitespace-nowrap">#{order.id}</td>
                        <td className="p-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{order.customerId}</td>
                        <td className="p-4 text-sm text-foreground">{order.description}</td>
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
                            {statusLabel || "pending"}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex justify-end items-center gap-2">
                            <select
                              className="h-9 rounded-md border border-border bg-muted px-3 text-sm outline-none"
                              value={current}
                              onChange={(e) =>
                                setStatusByOrderId((prev) => ({ ...prev, [order.id]: e.target.value as AllowedStatus }))
                              }
                              disabled={!isEmployee || saving}
                            >
                              {allowedStatuses.map((s) => (
                                <option key={s} value={s}>
                                  {s.replace("_", " ")}
                                </option>
                              ))}
                            </select>
                            <PrimaryButton
                              size="sm"
                              className="h-9 px-3"
                              onClick={() => save(order.id)}
                              disabled={!isEmployee || saving}
                            >
                              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </PrimaryButton>
                            <Link href={ROUTES.orders.detail(order.id)}>
                              <PrimaryButton size="sm" variant="secondary" className="h-9 px-3">
                                Open
                              </PrimaryButton>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function WorkProgressPage() {
  return (
    <Suspense fallback={null}>
      <WorkProgressPageContent />
    </Suspense>
  );
}
