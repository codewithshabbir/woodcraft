"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { getProfile } from "@/services/auth/profile.service";

const allowedStatuses = ["pending", "in_progress", "completed"] as const;
type AllowedStatus = (typeof allowedStatuses)[number];

export default function EmployeeProgressPanel({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [isEmployee, setIsEmployee] = React.useState(false);
  const [status, setStatus] = React.useState<AllowedStatus>(
    (allowedStatuses.includes(currentStatus as AllowedStatus) ? (currentStatus as AllowedStatus) : "pending"),
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    getProfile()
      .then((profile) => {
        if (!active) return;
        setIsEmployee(profile?.role === "employee");
      })
      .catch((err) => {
        console.error("[employee-progress] failed to load profile", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to update progress.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update progress.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEmployee) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Update Task Progress</CardTitle>
        <CardDescription>Update order status (UC11).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <StatusMessage type="error" message={error} /> : null}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</label>
          <select
            className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value as AllowedStatus)}
          >
            {allowedStatuses.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <PrimaryButton className="p-5" disabled={isSubmitting} onClick={save}>
          {isSubmitting ? "Saving..." : "Save Progress"}
        </PrimaryButton>
      </CardContent>
    </Card>
  );
}
