"use client";

import { Award, Briefcase, Clock3, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const performance = [
  { name: "Ali Raza", role: "Senior Carpenter", score: 94, jobs: 12, hours: 188 },
  { name: "Sajid Iqbal", role: "Finishing Worker", score: 86, jobs: 10, hours: 164 },
  { name: "Usman Tariq", role: "Installer", score: 78, jobs: 6, hours: 122 },
];

export default function EmployeeReportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Employee Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Productivity, utilization, and output quality across workshop staff
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Avg Productivity", val: "86%", icon: TrendingUp, color: "text-primary" },
          { label: "Top Performer", val: "Ali Raza", icon: Award, color: "text-emerald-600" },
          { label: "Open Assignments", val: 9, icon: Briefcase, color: "text-sky-600" },
          { label: "Total Work Hours", val: 474, icon: Clock3, color: "text-amber-600" },
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
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
          <CardDescription>Efficiency score based on workload, hours, and task completion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {performance.map((employee) => (
            <div key={employee.name} className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-primary">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-muted-foreground">Jobs: <span className="font-semibold text-foreground">{employee.jobs}</span></span>
                  <span className="text-muted-foreground">Hours: <span className="font-semibold text-foreground">{employee.hours}</span></span>
                  <span className="text-muted-foreground">Score: <span className="font-semibold text-primary">{employee.score}%</span></span>
                </div>
              </div>
              <div className="mt-4"><Progress value={employee.score} className="h-2" /></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
