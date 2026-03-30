"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarRange,
  CircleDollarSign,
  Clock3,
  Package,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const monthlyFinance = [
  { month: "Jan", income: 620000, expenses: 390000 },
  { month: "Feb", income: 710000, expenses: 440000 },
  { month: "Mar", income: 985000, expenses: 560000 },
  { month: "Apr", income: 840000, expenses: 510000 },
  { month: "May", income: 930000, expenses: 575000 },
  { month: "Jun", income: 1010000, expenses: 610000 },
];

const operations = [
  { label: "Average Completion Time", value: "9.4 days", icon: Clock3, color: "text-sky-600" },
  { label: "Revenue Margin", value: "38%", icon: CircleDollarSign, color: "text-emerald-600" },
  { label: "Material Utilization", value: "84%", icon: Package, color: "text-amber-600" },
  { label: "Worker Productivity", value: "91%", icon: Users, color: "text-primary" },
];

const departmentPerformance = [
  { name: "Carpentry", value: 93 },
  { name: "Finishing", value: 86 },
  { name: "Installation", value: 79 },
  { name: "Paint & Polish", value: 88 },
];

const materialDemand = [
  { material: "Oak Wood", usage: 92 },
  { material: "Pine Wood", usage: 76 },
  { material: "Walnut Sheet", usage: 64 },
  { material: "Hardware Sets", usage: 58 },
];

export default function DashboardAnalyticsPage() {
  const [range, setRange] = useState("6-months");
  const chartMax = useMemo(
    () => Math.max(...monthlyFinance.map((item) => Math.max(item.income, item.expenses))),
    [],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Financial and operational analysis across orders, inventory, and labor
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm">
          <CalendarRange className="ml-2 h-4 w-4 text-muted-foreground" />
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="h-10 rounded-md bg-transparent px-2 text-sm outline-none"
          >
            <option value="30-days">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
            <option value="6-months">Last 6 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {operations.map((item) => (
          <Card key={item.label} className="rounded-xl border border-border shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <h2 className={cn("mt-1 text-2xl font-bold", item.color)}>{item.value}</h2>
              </div>
              <item.icon className={cn("h-8 w-8 opacity-20", item.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Revenue and cost movement over the selected reporting period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-6 gap-4">
              {monthlyFinance.map((month) => (
                <div key={month.month} className="flex flex-col items-center gap-3">
                  <div className="flex h-64 items-end gap-2">
                    <div className="w-5 rounded-t-md bg-primary/85" style={{ height: `${(month.income / chartMax) * 100}%` }} />
                    <div className="w-5 rounded-t-md bg-amber-400/90" style={{ height: `${(month.expenses / chartMax) * 100}%` }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">{month.month}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Rs. {(month.income / 1000).toFixed(0)}k / {(month.expenses / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Efficiency score based on completion speed and output</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {departmentPerformance.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{item.name}</span>
                  <span className="font-bold text-primary">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Most Used Materials</CardTitle>
            <CardDescription>Consumption pressure across the highest-demand inventory items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {materialDemand.map((item) => (
              <div key={item.material} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{item.material}</p>
                  <p className="text-sm text-muted-foreground">Usage index this period</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{item.usage}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Operational Notes</CardTitle>
            <CardDescription>Important takeaways from current workshop performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "March delivered the highest margin due to large office-fitout orders.",
              "Low stock pressure is concentrated in finishing materials, not core wood stock.",
              "Installation capacity is the main bottleneck before delivery closures.",
              "Payment recovery is strongest for commercial clients compared to custom retail jobs.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-border bg-muted/20 p-4">
                <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
