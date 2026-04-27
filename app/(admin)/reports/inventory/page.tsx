"use client";

import { useCallback, useState } from "react";
import { Boxes, ShieldAlert, TrendingDown, Warehouse } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { cn } from "@/lib/helpers";
import { formatNumber } from "@/lib/format";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { getInventoryReport } from "@/services/reports/report.service";

export default function InventoryReportPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const loadReport = useCallback(() => getInventoryReport({ startDate: startDate || undefined, endDate: endDate || undefined }), [endDate, startDate]);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadReport });

  if (isLoading) return <LoadingState title="Loading inventory report..." />;
  if (error || !data) return <ErrorState title="Inventory report could not be loaded" description={error || "No report data returned."} actionLabel="Retry" onAction={reload} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Material usage, quantity pressure, and reorder insight for workshop planning
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 md:flex-row md:items-end">
        <label className="flex-1 text-sm">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Start Date</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none" />
        </label>
        <label className="flex-1 text-sm">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">End Date</span>
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="h-10 w-full rounded-md border border-border bg-background px-3 outline-none" />
        </label>
        <PrimaryButton className="h-10 px-4" onClick={() => reload()}>Apply Filter</PrimaryButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tracked Materials", val: data.summary.trackedMaterials, icon: Boxes, color: "text-primary" },
          { label: "Critical Alerts", val: data.summary.criticalAlerts, icon: ShieldAlert, color: "text-red-600" },
          { label: "Fast Moving Items", val: data.summary.fastMovingItems, icon: TrendingDown, color: "text-amber-600" },
          { label: "Inventory Value", val: `Rs. ${formatNumber(data.summary.inventoryValue)}`, icon: Warehouse, color: "text-sky-600" },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl border border-border shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <h2 className={cn("mt-1 text-2xl font-bold", item.color)}>{item.val}</h2>
              </div>
              <item.icon className={cn("h-8 w-8 opacity-20", item.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Consumption Intensity</CardTitle>
            <CardDescription>Highest-use materials during active production cycles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.inventoryUsage.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">Remaining: {item.remaining}</p>
                  </div>
                  <span className="font-bold text-primary">{item.consumed}%</span>
                </div>
                <Progress value={item.consumed} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Inventory Notes</CardTitle>
            <CardDescription>Key observations from current quantity movement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.notes.map((item) => (
              <div key={item} className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
