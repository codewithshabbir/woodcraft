"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import PageHeader from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants/routes";
import { createExpense } from "@/services/admin/admin.service";

export default function NewExpensePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await createExpense({
        type: String(formData.get("type") ?? ""),
        amount: Number(formData.get("amount") ?? 0),
        date: String(formData.get("date") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      });
      router.push(`${ROUTES.expenses.root}?message=${encodeURIComponent(result.message)}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Expense could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Add Expense"
        description="Record an expense entry for reports."
        backHref={ROUTES.expenses.root}
        action={
          <Link href={ROUTES.expenses.root}>
            <PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary">
              <ArrowLeft className="h-4 w-4" />
              Back
            </PrimaryButton>
          </Link>
        }
      />

      {submitError ? <StatusMessage type="error" message={submitError} /> : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Field label="Type">
              <Input name="type" className="h-10" placeholder="e.g., Rent / Electricity / Tools" required />
            </Field>
            <Field label="Amount">
              <Input name="amount" type="number" className="h-10" min={0} required />
            </Field>
            <Field label="Date">
              <Input name="date" type="date" className="h-10" required />
            </Field>
            <Field label="Notes (optional)">
              <Input name="notes" className="h-10" placeholder="Optional notes" />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={ROUTES.expenses.root}>
            <PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton>
          </Link>
          <PrimaryButton className="p-5" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Expense"}
          </PrimaryButton>
        </div>
      </form>
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

