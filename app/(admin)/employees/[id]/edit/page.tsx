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
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        employeeType: String(formData.get("employeeType") ?? ""),
        hourlyRate: Number(formData.get("hourlyRate") ?? 0),
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
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name">
              <Input name="name" className="h-10" defaultValue={employee.name} required />
            </Field>
            <Field label="Email">
              <Input name="email" className="h-10" defaultValue={employee.email ?? ""} required />
            </Field>
            <Field label="Employee Type (Skill Type)">
              <Input name="employeeType" className="h-10" defaultValue={employee.employeeType ?? ""} required />
            </Field>
            <Field label="Hourly Rate">
              <Input name="hourlyRate" type="number" className="h-10" defaultValue={employee.hourlyRate ?? 0} min={0} required />
            </Field>
            <Field label="Reset Password (optional)">
              <Input name="password" type="password" className="h-10" placeholder="Leave blank to keep current" />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={ROUTES.employees.detail(id)}>
            <PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton>
          </Link>
          <PrimaryButton className="p-5" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>; }

