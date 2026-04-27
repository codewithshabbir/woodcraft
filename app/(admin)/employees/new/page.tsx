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
import { createEmployee } from "@/services/admin/admin.service";

export default function NewEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await createEmployee({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        employeeType: String(formData.get("employeeType") ?? ""),
        hourlyRate: Number(formData.get("hourlyRate") ?? 0),
      });

      router.push(`${ROUTES.employees.root}?message=${encodeURIComponent(result.message)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Employee could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Add Employee</h1>
          <p className="mt-1 text-sm text-muted-foreground">Register new craftsmen, assign wages, and define workshop roles</p>
        </div>

        <Link href={ROUTES.employees.root}>
          <PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
          </PrimaryButton>
        </Link>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
            <CardDescription>Register an employee account with skill type and hourly wage.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name">
              <Input name="name" className="h-10" placeholder="Muhammad Ali" required />
            </Field>
            <Field label="Email Address">
              <Input name="email" className="h-10" placeholder="worker@woodcraft.com" required />
            </Field>
            <Field label="Password">
              <Input name="password" type="password" className="h-10" required />
            </Field>
            <Field label="Employee Type (Skill Type)">
              <Input name="employeeType" className="h-10" placeholder="carpenter / painter / polisher" required />
            </Field>
            <Field label="Hourly Rate">
              <Input name="hourlyRate" type="number" className="h-10" placeholder="850" min={0} required />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={ROUTES.employees.root}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link>
          <PrimaryButton className="p-5" disabled={isSubmitting}><Save className="h-4 w-4" />{isSubmitting ? "Creating..." : "Create Employee"}</PrimaryButton>
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

