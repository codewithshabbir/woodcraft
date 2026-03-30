"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, ShieldCheck, UserRoundPlus, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { createEmployee } from "@/services/admin/admin.service";

const skillOptions = ["Cabinet assembly", "Detail finishing", "Site installation", "Custom carving"];

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
      const skills = formData.getAll("skills").map((value) => String(value));
      const role = String(formData.get("role") ?? "Senior Carpenter");
      const result = await createEmployee({
        name: String(formData.get("name") ?? ""),
        role,
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        nationalId: String(formData.get("nationalId") ?? ""),
        joiningDate: String(formData.get("joiningDate") ?? ""),
        employmentType: String(formData.get("employmentType") ?? ""),
        shift: String(formData.get("shift") ?? ""),
        supervisor: String(formData.get("supervisor") ?? ""),
        hourlyRate: Number(formData.get("hourlyRate") ?? 0),
        overtimeRate: Number(formData.get("overtimeRate") ?? 0),
        status: String(formData.get("status") ?? "Active") as "Active" | "On Leave" | "Inactive",
        weeklyHours: 0,
        activeJobs: 0,
        efficiency: 0,
        skills,
        notes: String(formData.get("notes") ?? ""),
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

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Employee identity and contact details for staff records</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <Field label="Full Name"><Input name="name" className="h-10" placeholder="Muhammad Ali" /></Field>
                <Field label="Employee ID"><Input name="id" className="h-10" placeholder="EMP-004" /></Field>
                <Field label="Phone Number"><Input name="phone" className="h-10" placeholder="+92 300 0000000" /></Field>
                <Field label="Email Address"><Input name="email" className="h-10" placeholder="worker@woodcraft.com" /></Field>
                <Field label="CNIC / National ID"><Input name="nationalId" className="h-10" placeholder="42101-1234567-1" /></Field>
                <Field label="Joining Date"><Input name="joiningDate" type="date" className="h-10" /></Field>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Job Assignment</CardTitle>
                <CardDescription>Define role, skills, and operational responsibility</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <Field label="Primary Role"><select name="role" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option>Senior Carpenter</option><option>Carpenter</option><option>Finishing Worker</option><option>Painter / Polisher</option><option>Installer</option></select></Field>
                <Field label="Employment Type"><select name="employmentType" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option>Full Time</option><option>Contract</option><option>Part Time</option></select></Field>
                <Field label="Shift"><select name="shift" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option>Morning</option><option>Evening</option><option>Flexible</option></select></Field>
                <Field label="Supervisor"><Input name="supervisor" className="h-10" placeholder="Workshop Manager" /></Field>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
                <CardDescription>Wage details used for labor costing and payroll reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Hourly Rate"><Input name="hourlyRate" type="number" className="h-10" placeholder="850" /></Field>
                <Field label="Overtime Rate"><Input name="overtimeRate" type="number" className="h-10" placeholder="1100" /></Field>
                <Field label="Status"><select name="status" className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option>Active</option><option>On Leave</option><option>Inactive</option></select></Field>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader><CardTitle>Notes & Skills</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {skillOptions.map((skill) => (
                    <label key={skill} className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                      <input type="checkbox" name="skills" value={skill} className="h-4 w-4" />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>

                <textarea name="notes" className="min-h-[120px] w-full rounded-md border border-border p-3 text-sm outline-none" placeholder="Experience, certifications, or workshop notes..." />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="space-y-4 p-5">
                <InfoRow icon={UserRoundPlus} title="Workforce Planning" text="New employee records will later connect to job assignments and performance reports." />
                <InfoRow icon={Wallet} title="Labor Costing" text="Hourly and overtime rates support the cost estimation and billing modules." />
                <InfoRow icon={ShieldCheck} title="Admin Control" text="Status and role fields prepare the record for admin-only updates later." />
              </CardContent>
            </Card>
          </div>
        </div>

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

function InfoRow({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-muted/20 p-4">
      <div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
