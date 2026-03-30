"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { getEmployee, updateEmployee } from "@/services/admin/admin.service";
import { useAsyncResource } from "@/hooks/use-async-resource";

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const loadEmployee = React.useCallback(() => getEmployee(id), [id]);
  const { data: employee, error, isLoading } = useAsyncResource({ loader: loadEmployee });
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await updateEmployee(id, {
        name: String(formData.get("name") ?? ""),
        role: String(formData.get("role") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        hourlyRate: Number(formData.get("hourlyRate") ?? 0),
        weeklyHours: Number(formData.get("weeklyHours") ?? 0),
        status: String(formData.get("status") ?? "Active") as "Active" | "On Leave" | "Inactive",
        notes: String(formData.get("notes") ?? ""),
      });

      router.push(`${ROUTES.employees.root}?message=${encodeURIComponent(result.message)}`);
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Employee could not be updated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !employee) {
    return <div className="mx-auto max-w-6xl text-sm text-muted-foreground">Loading employee...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-primary">Edit Employee</h1><p className="mt-1 text-sm text-muted-foreground">Update employee role, hours, and rate details</p></div><Link href={ROUTES.employees.detail(id)}><PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton></Link></div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? <StatusMessage type="error" message={error} /> : null}
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}
        <Card className="shadow-sm"><CardHeader><CardTitle>Employee Information</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-2"><Field label="Full Name"><Input name="name" className="h-10" defaultValue={employee.name} /></Field><Field label="Role"><Input name="role" className="h-10" defaultValue={employee.role} /></Field><Field label="Phone"><Input name="phone" className="h-10" defaultValue={employee.phone} /></Field><Field label="Hourly Rate"><Input name="hourlyRate" type="number" className="h-10" defaultValue={employee.hourlyRate ?? 950} /></Field><Field label="Weekly Hours"><Input name="weeklyHours" type="number" className="h-10" defaultValue={employee.weeklyHours} /></Field><Field label="Status"><select name="status" defaultValue={employee.status} className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option value="Active">Active</option><option value="On Leave">On Leave</option><option value="Inactive">Inactive</option></select></Field></CardContent></Card><Card className="shadow-sm"><CardHeader><CardTitle>Notes</CardTitle></CardHeader><CardContent><textarea name="notes" className="min-h-[120px] w-full rounded-md border border-border p-3 text-sm outline-none" defaultValue={employee.notes ?? ""} /></CardContent></Card><div className="flex justify-end gap-3"><Link href={ROUTES.employees.detail(id)}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link><PrimaryButton className="p-5" disabled={isSubmitting}><Save className="h-4 w-4" />{isSubmitting ? "Saving..." : "Save Changes"}</PrimaryButton></div></form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>; }

