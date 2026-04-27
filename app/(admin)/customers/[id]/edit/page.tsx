"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { getCustomer, updateCustomer } from "@/services/admin/admin.service";

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const loadCustomer = React.useCallback(() => getCustomer(id), [id]);
  const { data: customer, error, isLoading } = useAsyncResource({ loader: loadCustomer });
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await updateCustomer(id, {
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
      });

      router.push(`${ROUTES.customers.root}?message=${encodeURIComponent(result.message)}`);
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Customer could not be updated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !customer) {
    return <div className="mx-auto max-w-5xl text-sm text-muted-foreground">Loading customer...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Customer</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update customer contact information used across orders and billing</p>
        </div>
        <Link href={ROUTES.customers.detail(id)}>
          <PrimaryButton variant="outline" className="border-primary p-5 hover:border-primary">
            <ArrowLeft className="h-4 w-4" />
            Back
          </PrimaryButton>
        </Link>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? <StatusMessage type="error" message={error} /> : null}
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}

        <Card className="shadow-sm">
          <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name"><Input name="name" className="h-10" defaultValue={customer.name} /></Field>
            <Field label="Phone"><Input name="phone" className="h-10" defaultValue={customer.phone} /></Field>
            <Field label="Email"><Input name="email" className="h-10" defaultValue={customer.email} /></Field>
            <Field label="Address"><Input name="address" className="h-10" defaultValue={customer.address} /></Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={ROUTES.customers.detail(id)}>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
