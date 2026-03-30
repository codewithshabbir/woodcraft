"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { Clock, Eye, Layers } from "lucide-react";

import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { listWorkAssignments } from "@/services/admin/admin.service";

export default function WorkProgressPage() {
  const loadAssignments = useCallback(() => listWorkAssignments(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadAssignments });

  const progressData = useMemo(() => (data ?? []).filter((task) => task.status !== "Completed"), [data]);

  const stats = useMemo(() => {
    const total = progressData.length;
    const avgProgress = total === 0 ? 0 : progressData.reduce((acc, task) => acc + (task.completed / Math.max(task.quantity, 1)) * 100, 0) / total;
    return { total, avgProgress: Math.round(avgProgress || 0) };
  }, [progressData]);

  if (isLoading) return <LoadingState title="Loading work progress..." />;
  if (error) return <ErrorState title="Work progress could not be loaded" description={error} actionLabel="Retry" onAction={reload} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Work Progress</h1>
        <p className="text-sm text-muted-foreground">Track ongoing work and progress status</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card><CardContent className="flex justify-between p-5"><div><p className="text-xs uppercase text-muted-foreground">Active Tasks</p><h2 className="text-2xl font-bold">{stats.total}</h2></div><Layers className="h-6 w-6 opacity-30" /></CardContent></Card>
        <Card><CardContent className="flex justify-between p-5"><div><p className="text-xs uppercase text-muted-foreground">Avg Progress</p><h2 className="text-2xl font-bold text-blue-600">{stats.avgProgress}%</h2></div><Clock className="h-6 w-6 text-blue-600 opacity-30" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Ongoing Work</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[900px] text-sm">
              <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground"><th className="p-4 text-[11px] font-bold uppercase">ID</th><th className="p-4 text-[11px] font-bold uppercase">Worker</th><th className="p-4 text-[11px] font-bold uppercase">Material</th><th className="p-4 text-[11px] font-bold uppercase">Progress</th><th className="p-4 text-[11px] font-bold uppercase">Deadline</th><th className="p-4 text-right text-[11px] font-bold uppercase">Action</th></tr></thead>
              <tbody>
                {progressData.map((task) => {
                  const percent = Math.round((task.completed / Math.max(task.quantity, 1)) * 100);
                  return (
                    <tr key={task.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{task.id}</td>
                      <td className="p-4 font-semibold text-primary">{task.worker}</td>
                      <td className="p-4">{task.material}</td>
                      <td className="w-[250px] p-4"><div className="space-y-2"><div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className={cn("h-full transition-all", percent < 40 ? "bg-red-500" : percent < 80 ? "bg-yellow-500" : "bg-green-500")} style={{ width: `${percent}%` }} /></div><p className="text-xs text-muted-foreground">{task.completed} / {task.quantity} ({percent}%)</p></div></td>
                      <td className="p-4 text-muted-foreground">{task.deadline}</td>
                      <td className="p-4 text-right"><Link href={ROUTES.production.assignWork.detail(task.id)}><PrimaryButton size="sm" className="h-8 w-8 p-2"><Eye className="h-4 w-4" /></PrimaryButton></Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
