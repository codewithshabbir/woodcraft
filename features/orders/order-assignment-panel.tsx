"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { listEmployees } from "@/services/admin/admin.service";
import { getProfile } from "@/services/auth/profile.service";

export default function OrderAssignmentPanel({
  orderId,
  assignedEmployeeIds,
}: {
  orderId: string;
  assignedEmployeeIds: string[];
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [employees, setEmployees] = React.useState<Array<{ id: string; name: string; employeeType: string }>>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    getProfile()
      .then((profile) => {
        if (!active) return;
        const admin = profile?.role === "admin";
        setIsAdmin(admin);
        if (!admin) return;
        listEmployees()
          .then((rows) => {
            if (!active) return;
            setEmployees(rows.map((e) => ({ id: e.id, name: e.name, employeeType: e.employeeType })));
          })
          .catch((err) => {
            console.error("[order-assignment] failed to load employees", err);
            if (!active) return;
            setError(err instanceof Error ? err.message : "Failed to load employees.");
          });
      })
      .catch((err) => {
        console.error("[order-assignment] failed to load profile", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const assign = async () => {
    if (!selectedEmployeeId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: selectedEmployeeId }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to assign worker.");
      }
      setSelectedEmployeeId("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to assign worker.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) return null;

  const assignedLabel = assignedEmployeeIds.length ? assignedEmployeeIds.join(", ") : "No workers assigned.";

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Assign Worker
        </CardTitle>
        <CardDescription>Assign employees to this order (UC06).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <StatusMessage type="error" message={error} /> : null}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Assigned:</span> {assignedLabel}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Employee</label>
            <select
              className="mt-2 h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id} disabled={assignedEmployeeIds.includes(e.id)}>
                  {e.name} ({e.employeeType || "employee"}) - {e.id}
                </option>
              ))}
            </select>
          </div>
          <PrimaryButton className="p-5" disabled={!selectedEmployeeId || isSubmitting} onClick={assign}>
            {isSubmitting ? "Assigning..." : "Assign"}
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
}
