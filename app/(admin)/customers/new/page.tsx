"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { createCustomer } from "@/services/admin/admin.service";

export default function NewCustomerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await createCustomer({
        id: String(formData.get("id") ?? ""),
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
      });

      router.push(`${ROUTES.customers.root}?message=${encodeURIComponent(result.message)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Customer could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Add Customer</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create a customer record before raising orders</p>
        </div>
        <Link href={ROUTES.customers.root}>
          <PrimaryButton variant="outline" className="border-primary p-5 hover:border-primary">
            <ArrowLeft className="h-4 w-4" />
            Back
          </PrimaryButton>
        </Link>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}

        <Card className="shadow-sm">
          <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Field label="Customer ID"><Input name="id" className="h-10" placeholder="CUST-004" /></Field>
            <Field label="Full Name"><Input name="name" className="h-10" placeholder="Sana Homes" /></Field>
            <Field label="Phone"><Input name="phone" className="h-10" placeholder="+92 300 0000000" /></Field>
            <Field label="Email"><Input name="email" className="h-10" placeholder="customer@example.com" /></Field>
            <Field label="Address" className="md:col-span-2"><Input name="address" className="h-10" placeholder="City, area, or workshop site" /></Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={ROUTES.customers.root}>
            <PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton>
          </Link>
          <PrimaryButton className="p-5" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create Customer"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className ? `space-y-2 ${className}` : "space-y-2"}>
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
