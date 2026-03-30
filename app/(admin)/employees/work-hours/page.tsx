"use client";

import { useMemo, useState } from "react";
import { Clock3, Search, Timer, WalletCards, Wrench } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

const workLogs = [
  { employee: "Ali Raza", orderId: "ORD-104", task: "Cabinet Frame Assembly", hours: 18, overtime: 4, wage: 20900, completion: 88 },
  { employee: "Sajid Iqbal", orderId: "ORD-101", task: "Sanding and Finish Prep", hours: 14, overtime: 2, wage: 11200, completion: 76 },
  { employee: "Usman Tariq", orderId: "ORD-098", task: "On-site Installation", hours: 10, overtime: 0, wage: 8000, completion: 62 },
];

export default function EmployeeWorkHoursPage() {
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    return workLogs.filter((log) =>
      `${log.employee} ${log.orderId} ${log.task}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  const stats = useMemo(() => {
    const totalHours = filteredLogs.reduce((sum, log) => sum + log.hours, 0);
    const overtimeHours = filteredLogs.reduce((sum, log) => sum + log.overtime, 0);
    const laborCost = filteredLogs.reduce((sum, log) => sum + log.wage, 0);
    const avgCompletion = Math.round(
      filteredLogs.reduce((sum, log) => sum + log.completion, 0) /
        Math.max(filteredLogs.length, 1),
    );

    return { totalHours, overtimeHours, laborCost, avgCompletion };
  }, [filteredLogs]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Work Hours</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track employee work logs, wages, and task completion rates
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Hours", val: stats.totalHours, icon: Clock3, color: "text-primary" },
          { label: "Overtime", val: `${stats.overtimeHours} hrs`, icon: Timer, color: "text-amber-600" },
          { label: "Labor Cost", val: `Rs. ${formatNumber(stats.laborCost)}`, icon: WalletCards, color: "text-emerald-600" },
          { label: "Task Completion", val: `${stats.avgCompletion}%`, icon: Wrench, color: "text-sky-600" },
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

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center w-full max-w-md">
            <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-muted px-3 focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by employee, order ID, or task..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Work Logs</CardTitle>
            <CardDescription>Logged hours for assigned jobs and wage impact per task</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="p-4 text-[11px] font-bold uppercase">Employee</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Order</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Task</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Hours</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Overtime</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Wage</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={`${log.employee}-${log.orderId}`} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                      <td className="p-4 font-semibold text-primary">{log.employee}</td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{log.orderId}</td>
                      <td className="p-4">{log.task}</td>
                      <td className="p-4">{log.hours} hrs</td>
                      <td className="p-4">{log.overtime} hrs</td>
                      <td className="p-4 font-semibold">Rs. {formatNumber(log.wage)}</td>
                      <td className="p-4 w-[220px]">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-bold text-primary">{log.completion}%</span>
                          </div>
                          <Progress value={log.completion} className="h-2" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Wage Summary</CardTitle>
            <CardDescription>Quick labor overview for weekly admin review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Regular Hours Share", value: `${Math.round((stats.totalHours / (stats.totalHours + stats.overtimeHours)) * 100)}%` },
              { title: "Overtime Exposure", value: `${Math.round((stats.overtimeHours / Math.max(stats.totalHours, 1)) * 100)}%` },
              { title: "Avg Wage / Task", value: `Rs. ${formatNumber(Math.round(stats.laborCost / Math.max(filteredLogs.length, 1)))}` },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="mt-1 text-2xl font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}