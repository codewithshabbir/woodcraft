"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Clock3, Search, Timer, WalletCards, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { StatusMessage } from "@/components/shared/status-message";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { cn } from "@/lib/helpers";
import { formatNumber } from "@/lib/format";
import { createWorkLog, listEmployees, listOrders, listWorkLogs, updateWorkLog } from "@/services/admin/admin.service";
import { getProfile } from "@/services/auth/profile.service";

export default function EmployeeWorkHoursPage() {
  const [search, setSearch] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProfile = useCallback(() => getProfile(), []);
  const loadWorkLogs = useCallback(() => listWorkLogs(), []);
  const loadEmployees = useCallback(async () => {
    const profile = await getProfile();
    return profile?.role === "employee" ? [] : listEmployees();
  }, []);
  const loadOrders = useCallback(async () => {
    const profile = await getProfile();
    void profile;
    return listOrders();
  }, []);

  const { data: profile } = useAsyncResource({ loader: loadProfile });
  const { data: workLogs, error, isLoading, reload } = useAsyncResource({ loader: loadWorkLogs });
  const { data: employees } = useAsyncResource({ loader: loadEmployees, initialData: [] });
  const { data: orders } = useAsyncResource({ loader: loadOrders, initialData: [] });
  const isEmployee = profile?.role === "employee";

  const availableOrders = useMemo(() => orders ?? [], [orders]);

  const filteredLogs = useMemo(() => {
    return (workLogs ?? []).filter((log) =>
      `${log.userName ?? ""} ${log.orderLabel ?? ""} ${log.taskDescription ?? ""} ${log.status}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, workLogs]);

  const stats = useMemo(() => {
    const approvedLogs = filteredLogs.filter((log) => log.status === "approved");
    const pendingLogs = filteredLogs.filter((log) => log.status === "pending");
    const totalHours = approvedLogs.reduce((sum, log) => sum + log.hoursWorked, 0);
    const approvedWages = approvedLogs.reduce((sum, log) => sum + (log.wage || 0), 0);

    return {
      totalHours,
      pendingCount: pendingLogs.length,
      approvedWages,
      totalLogs: filteredLogs.length,
    };
  }, [filteredLogs]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const employeeId = String(formData.get("employeeId") ?? "");
      await createWorkLog({
        ...(isEmployee ? {} : { userId: employeeId }),
        orderId: String(formData.get("orderId") ?? ""),
        taskDescription: String(formData.get("taskDescription") ?? ""),
        progress: Number(formData.get("progress") ?? 0),
        hoursWorked: Number(formData.get("hoursWorked") ?? 0),
        workDate: String(formData.get("workDate") ?? ""),
        status: "pending",
      });

      event.currentTarget.reset();
      await reload();
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Work log could not be recorded.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    await updateWorkLog(id, { status });
    await reload();
  };

  if (isLoading) return <LoadingState title="Loading work hours..." />;
  if (error) return <ErrorState title="Work hours could not be loaded" description={error} actionLabel="Retry" onAction={reload} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Work Hours</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEmployee
            ? "Record your work hours and review the status of your submitted logs"
            : "Record employee hours, approve entries, and calculate wages from real work logs"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Approved Hours", val: `${stats.totalHours} hrs`, icon: Clock3, color: "text-primary" },
          { label: "Pending Review", val: stats.pendingCount, icon: Timer, color: "text-amber-600" },
          { label: "Approved Wages", val: `Rs. ${formatNumber(stats.approvedWages)}`, icon: WalletCards, color: "text-emerald-600" },
          { label: "Work Logs", val: stats.totalLogs, icon: Clock3, color: "text-sky-600" },
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

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{isEmployee ? "Log My Work Hours" : "Add Work Log"}</CardTitle>
            <CardDescription>
              {isEmployee
                ? "Submit your own hours against the orders assigned to you."
                : "Log hours against an order and review them from the same admin screen"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitError ? <StatusMessage type="error" message={submitError} className="mb-4" /> : null}
            <form className="space-y-4" onSubmit={handleCreate}>
              {!isEmployee ? (
                <Field label="Employee">
                  <select name="employeeId" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none">
                    <option value="">Select employee</option>
                    {(employees ?? []).map((employee) => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </Field>
              ) : null}

              <Field label="Order">
                <select name="orderId" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none">
                  <option value="">Select order</option>
                  {availableOrders.map((order) => (
                    <option key={order.id} value={order.id}>{order.id} - {order.customerId}</option>
                  ))}
                </select>
              </Field>

              <Field label="Task Description"><Input name="taskDescription" className="h-10" placeholder="Frame assembly" /></Field>
              <Field label="Progress (%)"><Input name="progress" type="number" min={0} max={100} className="h-10" placeholder="0" /></Field>
              <Field label="Hours Worked"><Input name="hoursWorked" type="number" min={1} className="h-10" placeholder="8" /></Field>
              <Field label="Work Date"><Input name="workDate" type="date" className="h-10" /></Field>

              <PrimaryButton className="w-full p-5" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Record Work Log"}
              </PrimaryButton>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{isEmployee ? "My Work Logs" : "Work Log Review"}</CardTitle>
            <CardDescription>
              {isEmployee
                ? "See the status of the work logs you have submitted."
                : "Approve or reject pending entries and keep wage totals up to date"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center w-full max-w-md">
              <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-muted px-3 focus-within:ring-2 focus-within:ring-ring">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by employee, order, task, or status..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="p-4 text-[11px] font-bold uppercase">Employee</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Order</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Task</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Hours</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Date</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Wage</th>
                    <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
                    <th className="p-4 text-[11px] font-bold uppercase text-right">{isEmployee ? "Review" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                      <td className="p-4 font-semibold text-primary">{log.userName}</td>
                      <td className="p-4 text-muted-foreground">{log.orderLabel}</td>
                      <td className="p-4">{log.taskDescription || "-"}</td>
                      <td className="p-4">{log.hoursWorked} hrs</td>
                      <td className="p-4">{log.workDate}</td>
                      <td className="p-4 font-semibold">Rs. {formatNumber(log.wage || 0)}</td>
                      <td className="p-4 text-center">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-[11px] font-bold uppercase",
                            log.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : log.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700",
                          )}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {!isEmployee && log.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <PrimaryButton
                              size="sm"
                              className="h-8 px-3"
                              onClick={() => handleStatusUpdate(log.id, "approved")}
                            >
                              <Check className="h-4 w-4" />
                            </PrimaryButton>
                            <PrimaryButton
                              size="sm"
                              variant="destructive"
                              className="h-8 px-3"
                              onClick={() => handleStatusUpdate(log.id, "rejected")}
                            >
                              <X className="h-4 w-4" />
                            </PrimaryButton>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {isEmployee ? "Awaiting admin review" : "Reviewed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
