"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Eye, Layers, Package, Pencil, Plus, Trash2 } from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { StatusMessage } from "@/components/shared/status-message";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeleteDialog from "@/features/admin/components/shared/confirm-delete-dialog";
import PageHeader from "@/features/admin/components/shared/page-header";
import StatCard from "@/features/admin/components/shared/stat-card";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { listWorkAssignments } from "@/services/admin/admin.service";

export default function AssignWorkListPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const loadWorkAssignments = useCallback(() => listWorkAssignments(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadWorkAssignments });

  const workAssignments = useMemo(() => data ?? [], [data]);

  const stats = useMemo(() => {
    const total = workAssignments.length;
    const pending = workAssignments.filter((assignment) => assignment.status === "Pending").length;
    const progress = workAssignments.filter((assignment) => assignment.status === "In Progress").length;

    return { total, pending, progress };
  }, [workAssignments]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assigned Work"
        description="Manage and track assigned tasks across active production jobs"
        action={
          <Link href={ROUTES.production.assignWork.new}>
            <PrimaryButton className="p-5">
              <Plus className="h-4 w-4" />
              Assign Work
            </PrimaryButton>
          </Link>
        }
      />

      {message ? <StatusMessage type="success" message={message} /> : null}

      {isLoading ? <LoadingState title="Loading assignments..." /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Assignments could not be loaded"
          description="The production task list is still using the mock service layer. Retry to restore the screen state."
          actionLabel="Retry"
          onAction={reload}
        />
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Tasks" value={stats.total} icon={Layers} color="text-primary" />
            <StatCard label="Pending" value={stats.pending} icon={Calendar} color="text-amber-600" />
            <StatCard label="In Progress" value={stats.progress} icon={Package} color="text-sky-600" />
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>Production assignments linked to order execution and material usage</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {workAssignments.length === 0 ? (
                <EmptyState
                  title="No assigned work found"
                  description="Assignments will appear here once workers are allocated to active orders."
                  className="min-h-[220px] rounded-none border-0"
                />
              ) : (
                <div className="w-full overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                        <th className="p-4 text-[11px] font-bold uppercase">ID</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Worker</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Material</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Qty</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Deadline</th>
                        <th className="p-4 text-center text-[11px] font-bold uppercase">Status</th>
                        <th className="p-4 text-right text-[11px] font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workAssignments.map((assignment) => (
                        <tr key={assignment.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                          <td className="p-4 text-xs font-mono text-muted-foreground">{assignment.id}</td>
                          <td className="p-4 font-semibold text-primary">{assignment.worker}</td>
                          <td className="p-4">{assignment.material}</td>
                          <td className="p-4">{assignment.quantity}</td>
                          <td className="p-4 text-muted-foreground">{assignment.deadline}</td>
                          <td className="p-4 text-center">
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-[11px] font-bold uppercase",
                                assignment.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : assignment.status === "In Progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700",
                              )}
                            >
                              {assignment.status}
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <Link href={ROUTES.production.assignWork.detail(assignment.id)}>
                                <PrimaryButton size="sm" className="h-8 w-8 p-2">
                                  <Eye className="h-4 w-4" />
                                </PrimaryButton>
                              </Link>
                              <Link href={ROUTES.production.assignWork.edit(assignment.id)}>
                                <PrimaryButton size="sm" variant="secondary" className="h-8 w-8 p-2">
                                  <Pencil className="h-4 w-4" />
                                </PrimaryButton>
                              </Link>
                              <ConfirmDeleteDialog
                                itemId={assignment.id}
                                entityLabel="task"
                                entityType="workAssignment"
                                trigger={
                                  <PrimaryButton size="sm" variant="destructive" className="h-8 w-8 p-2">
                                    <Trash2 className="h-4 w-4" />
                                  </PrimaryButton>
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

