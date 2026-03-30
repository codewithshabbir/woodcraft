"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { CheckCircle, Eye, Layers } from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { listWorkAssignments } from "@/services/admin/admin.service";

export default function CompletedWorkPage() {
  const loadAssignments = useCallback(() => listWorkAssignments(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadAssignments });

  const completedWork = useMemo(() => (data ?? []).filter((task) => task.status === "Completed").map((task) => ({ id: task.id, worker: task.worker, material: task.material, quantity: task.quantity, completedAt: task.deadline })), [data]);
  const stats = useMemo(() => ({ total: completedWork.length, totalQty: completedWork.reduce((acc, item) => acc + item.quantity, 0) }), [completedWork]);

  if (isLoading) return <LoadingState title="Loading completed work..." />;
  if (error) return <ErrorState title="Completed work could not be loaded" description={error} actionLabel="Retry" onAction={reload} />;

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold text-primary">Completed Work</h1><p className="text-sm text-muted-foreground">Track all completed tasks and production output</p></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Card><CardContent className="flex justify-between p-5"><div><p className="text-xs uppercase text-muted-foreground">Total Completed Tasks</p><h2 className="text-2xl font-bold">{stats.total}</h2></div><Layers className="h-6 w-6 opacity-30" /></CardContent></Card><Card><CardContent className="flex justify-between p-5"><div><p className="text-xs uppercase text-muted-foreground">Total Quantity</p><h2 className="text-2xl font-bold text-green-600">{stats.totalQty}</h2></div><CheckCircle className="h-6 w-6 text-green-600 opacity-30" /></CardContent></Card></div>
      <Card><CardHeader><CardTitle>Completed Tasks</CardTitle></CardHeader><CardContent className="p-0">{completedWork.length === 0 ? <EmptyState title="No completed work found" description="Completed assignments will appear here once tasks are marked done." className="min-h-[220px] rounded-none border-0" /> : <div className="w-full overflow-x-auto rounded-md border border-border"><table className="w-full min-w-[800px] text-sm"><thead><tr className="border-b bg-muted/30 text-left text-muted-foreground"><th className="p-4 text-[11px] font-bold uppercase">ID</th><th className="p-4 text-[11px] font-bold uppercase">Worker</th><th className="p-4 text-[11px] font-bold uppercase">Material</th><th className="p-4 text-[11px] font-bold uppercase">Quantity</th><th className="p-4 text-[11px] font-bold uppercase">Completed At</th><th className="p-4 text-right text-[11px] font-bold uppercase">Action</th></tr></thead><tbody>{completedWork.map((item) => <tr key={item.id} className="border-b border-border last:border-none hover:bg-muted/40 transition"><td className="p-4 font-mono text-xs text-muted-foreground">{item.id}</td><td className="p-4 font-semibold text-primary">{item.worker}</td><td className="p-4">{item.material}</td><td className="p-4 font-bold">{item.quantity}</td><td className="p-4 text-muted-foreground">{item.completedAt}</td><td className="p-4 text-right"><Link href={ROUTES.production.assignWork.detail(item.id)}><PrimaryButton size="sm" className="h-8 w-8 p-2"><Eye className="h-4 w-4" /></PrimaryButton></Link></td></tr>)}</tbody></table></div>}</CardContent></Card>
    </div>
  );
}
