"use client";

import { ArrowDown, ArrowUp, BanknoteArrowUp, Wallet2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

const monthlySales = [
  { month: "Jan", income: 620000, expenses: 390000 },
  { month: "Feb", income: 710000, expenses: 440000 },
  { month: "Mar", income: 985000, expenses: 560000 },
  { month: "Apr", income: 840000, expenses: 510000 },
];

const receivables = [
  { customer: "Ayesha Interiors", invoice: "INV-003", due: 125000, aging: "4 days" },
  { customer: "Nova Studio", invoice: "INV-001", due: 56000, aging: "1 day" },
  { customer: "Imran Khan", invoice: "INV-005", due: 18000, aging: "7 days" },
];

export default function SalesReportPage() {
  const maxValue = Math.max(...monthlySales.map((item) => Math.max(item.income, item.expenses)));
  const totalIncome = monthlySales.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlySales.reduce((sum, item) => sum + item.expenses, 0);
  const net = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Sales Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review revenue, expense spread, and outstanding invoice exposure
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Income", val: `Rs. ${formatNumber(totalIncome)}`, icon: ArrowUp, color: "text-emerald-600" },
          { label: "Total Expenses", val: `Rs. ${formatNumber(totalExpenses)}`, icon: ArrowDown, color: "text-red-600" },
          { label: "Net Position", val: `Rs. ${formatNumber(net)}`, icon: Wallet2, color: "text-primary" },
          { label: "Outstanding Due", val: "Rs. 1,99,000", icon: BanknoteArrowUp, color: "text-amber-600" },
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
              {monthlySales.map((item) => (
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
            {receivables.map((item) => (
              <div key={item.invoice} className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{item.customer}</p>
                    <p className="text-sm text-muted-foreground">{item.invoice}</p>
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