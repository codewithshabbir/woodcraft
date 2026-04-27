"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, BanknoteArrowUp, Wallet2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { cn } from "@/lib/helpers";
import { formatNumber } from "@/lib/format";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { getSalesReport } from "@/services/reports/report.service";

export default function SalesReportPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const loadReport = useCallback(() => getSalesReport({ startDate: startDate || undefined, endDate: endDate || undefined }), [endDate, startDate]);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadReport });
  const maxValue = useMemo(() => Math.max(1, ...(data?.monthlySales || []).map((item) => Math.max(item.income, item.expenses))), [data]);

  if (isLoading) return <LoadingState title="Loading sales report..." />;
  if (error || !data) return <ErrorState title="Sales report could not be loaded" description={error || "No report data returned."} actionLabel="Retry" onAction={reload} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Sales Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review revenue, expense spread, and outstanding invoice exposure
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
          { label: "Total Income", val: `Rs. ${formatNumber(data.summary.totalIncome)}`, icon: ArrowUp, color: "text-emerald-600" },
          { label: "Total Expenses", val: `Rs. ${formatNumber(data.summary.totalExpenses)}`, icon: ArrowDown, color: "text-red-600" },
          { label: "Net Position", val: `Rs. ${formatNumber(data.summary.net)}`, icon: Wallet2, color: "text-primary" },
          { label: "Outstanding Due", val: `Rs. ${formatNumber(data.summary.outstandingDue)}`, icon: BanknoteArrowUp, color: "text-amber-600" },
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

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Income Trend</CardTitle>
            <CardDescription>Comparison of revenue generation and operating cost</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {data.monthlySales.map((item) => (
                <div key={item.month} className="flex flex-col items-center gap-3">
                  <div className="flex h-64 items-end gap-2">
                    <div className="w-8 rounded-t-md bg-emerald-500/85" style={{ height: `${(item.income / maxValue) * 100}%` }} />
                    <div className="w-8 rounded-t-md bg-red-400/85" style={{ height: `${(item.expenses / maxValue) * 100}%` }} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{item.month}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {(item.income / 1000).toFixed(0)}k / {(item.expenses / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Receivables Watchlist</CardTitle>
            <CardDescription>Invoices with pending recovery attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.receivables.map((item) => (
              <div key={item.invoice} className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{item.invoice}</p>
                    <p className="text-sm text-muted-foreground">{item.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-700">Rs. {formatNumber(item.due)}</p>
                    <p className="text-xs text-muted-foreground">{item.aging}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
