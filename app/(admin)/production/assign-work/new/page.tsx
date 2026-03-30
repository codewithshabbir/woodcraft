"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { createWorkAssignment } from "@/services/admin/admin.service";

export default function NewAssignWorkPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await createWorkAssignment({
        orderId: String(formData.get("orderId") ?? ""),
        worker: String(formData.get("worker") ?? ""),
        material: String(formData.get("material") ?? ""),
        quantity: Number(formData.get("quantity") ?? 0),
        completed: 0,
        deadline: String(formData.get("deadline") ?? ""),
        priority: String(formData.get("priority") ?? "Medium"),
        status: String(formData.get("status") ?? "Pending") as "Pending" | "In Progress" | "Completed",
        notes: String(formData.get("notes") ?? ""),
      });

      router.push(`${ROUTES.production.assignWork.root}?message=${encodeURIComponent(result.message)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Task could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Assign Work</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create a new production task and assign it to a worker</p>
        </div>
        <Link href={ROUTES.production.assignWork.root}>
          <PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton>
        </Link>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>Define what needs to be built and who owns the work</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Field label="Task ID"><Input name="id" className="h-10" placeholder="AW-004" /></Field>
            <Field label="Order ID"><Input name="orderId" className="h-10" placeholder="ORD-104" /></Field>
            <Field label="Worker"><select name="worker" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option>Ali Raza</option><option>Sajid Iqbal</option><option>Usman Tariq</option></select></Field>
            <Field label="Material / Item"><Input name="material" className="h-10" placeholder="Oak Wood Panels" /></Field>
            <Field label="Quantity"><Input name="quantity" type="number" className="h-10" placeholder="10" /></Field>
            <Field label="Deadline"><Input name="deadline" type="date" className="h-10" /></Field>
            <Field label="Priority"><select name="priority" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option>High</option><option>Medium</option><option>Low</option></select></Field>
            <Field label="Status"><select name="status" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option>Pending</option><option>In Progress</option><option>Completed</option></select></Field>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
          <CardContent>
            <textarea name="notes" className="min-h-[120px] w-full rounded-md border border-border p-3 text-sm outline-none" placeholder="Cutting details, polish requirements, fitting instructions, or workshop notes..." />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={ROUTES.production.assignWork.root}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link>
          <PrimaryButton className="p-5" disabled={isSubmitting}><Save className="h-4 w-4" />{isSubmitting ? "Creating..." : "Create Task"}</PrimaryButton>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>;
}
