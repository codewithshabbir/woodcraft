"use client";

import { useCallback, useState } from "react";
import { Clock, Timer } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { getOrderTimelineReport } from "@/services/reports/report.service";

export default function OrderTimelinesReportPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadReport = useCallback(
    () => getOrderTimelineReport({ startDate: startDate || undefined, endDate: endDate || undefined }),
    [endDate, startDate],
  );
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadReport });

  if (isLoading) return <LoadingState title="Loading order timelines..." />;
  if (error || !data) {
    return (
      <ErrorState
        title="Order timelines could not be loaded"
        description={error || "No report data returned."}
        actionLabel="Retry"
        onAction={reload}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Order Timelines</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track completion time (UC10: order timeline reporting).</p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 md:flex-row md:items-end">
        <label className="flex-1 text-sm">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Start Date</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none" />
        </label>
        <label className="flex-1 text-sm">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">End Date</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none" />
        </label>
        <PrimaryButton className="h-10 px-4" onClick={() => reload()}>Apply Filter</PrimaryButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Completed Orders", value: data.summary.completedOrders, icon: Clock },
          { label: "Avg Days", value: data.summary.avgDays, icon: Timer },
          { label: "Min Days", value: data.summary.minDays, icon: Timer },
          { label: "Max Days", value: data.summary.maxDays, icon: Timer },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl border border-border shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <h2 className="mt-1 text-2xl font-bold text-primary">{item.value}</h2>
              </div>
              <item.icon className="h-8 w-8 text-primary/20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                  <th className="p-4 text-[11px] font-bold uppercase">Order</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Status</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Start</th>
                  <th className="p-4 text-[11px] font-bold uppercase">End</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Days</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                    <td className="p-4 font-mono text-xs text-muted-foreground">{o.id}</td>
                    <td className="p-4">{o.status.replace("_", " ")}</td>
                    <td className="p-4 text-muted-foreground">{o.startDate ? String(o.startDate).slice(0, 10) : "-"}</td>
                    <td className="p-4 text-muted-foreground">{o.endDate ? String(o.endDate).slice(0, 10) : "-"}</td>
                    <td className="p-4">{o.durationDays ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

