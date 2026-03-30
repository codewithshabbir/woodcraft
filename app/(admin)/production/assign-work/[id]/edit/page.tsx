"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { getWorkAssignment, updateWorkAssignment } from "@/services/admin/admin.service";
import { useAsyncResource } from "@/hooks/use-async-resource";

export default function EditAssignWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const loadAssignment = React.useCallback(() => getWorkAssignment(id), [id]);
  const { data: assignment, error, isLoading } = useAsyncResource({ loader: loadAssignment });
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await updateWorkAssignment(id, {
        worker: String(formData.get("worker") ?? ""),
        orderId: String(formData.get("orderId") ?? ""),
        material: String(formData.get("material") ?? ""),
        quantity: Number(formData.get("quantity") ?? 0),
        deadline: String(formData.get("deadline") ?? ""),
        status: String(formData.get("status") ?? "Pending") as "Pending" | "In Progress" | "Completed",
        notes: String(formData.get("notes") ?? ""),
      });

      router.push(`${ROUTES.production.assignWork.root}?message=${encodeURIComponent(result.message)}`);
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Task could not be updated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !assignment) {
    return <div className="mx-auto max-w-6xl text-sm text-muted-foreground">Loading assignment...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Assigned Work</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update worker assignment and task status</p>
        </div>
        <Link href={ROUTES.production.assignWork.detail(id)}><PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton></Link>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? <StatusMessage type="error" message={error} /> : null}
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}
        <Card className="shadow-sm"><CardHeader><CardTitle>Task Details</CardTitle><CardDescription>Adjust task ownership, quantity, and deadline</CardDescription></CardHeader><CardContent className="grid gap-6 md:grid-cols-2"><Field label="Worker"><Input name="worker" className="h-10" defaultValue={assignment.worker} /></Field><Field label="Order ID"><Input name="orderId" className="h-10" defaultValue={assignment.orderId} /></Field><Field label="Material / Item"><Input name="material" className="h-10" defaultValue={assignment.material} /></Field><Field label="Quantity"><Input name="quantity" type="number" className="h-10" defaultValue={assignment.quantity} /></Field><Field label="Deadline"><Input name="deadline" type="date" className="h-10" defaultValue={assignment.deadline} /></Field><Field label="Status"><select name="status" defaultValue={assignment.status} className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select></Field></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle>Notes</CardTitle></CardHeader><CardContent><textarea name="notes" className="min-h-[120px] w-full rounded-md border border-border p-3 text-sm outline-none" defaultValue={assignment.notes} /></CardContent></Card>
        <div className="flex justify-end gap-3"><Link href={ROUTES.production.assignWork.detail(id)}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link><PrimaryButton className="p-5" disabled={isSubmitting}><Save className="h-4 w-4" />{isSubmitting ? "Saving..." : "Save Changes"}</PrimaryButton></div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>; }

