"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { createSupplier } from "@/services/admin/admin.service";

type SupplierForm = {
  name: string;
  phone: string;
  email: string;
  location: string;
};

export default function AddSupplierPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SupplierForm>({
    name: "",
    phone: "",
    email: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createSupplier({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
      });

      router.push(`${ROUTES.suppliers.root}?message=${encodeURIComponent(result.message)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Supplier could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Add Supplier</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new supplier profile</p>
        </div>

        <Link href={ROUTES.suppliers.root}>
          <PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary">
            <ArrowLeft className="w-4 h-4" />
            Back
          </PrimaryButton>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}

        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Supplier Name">
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter supplier name" className="h-10 bg-muted/30" />
            </Field>
            <Field label="Phone">
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+92..." className="h-10 bg-muted/30" />
            </Field>
            <Field label="Email">
              <Input name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" className="h-10 bg-muted/30" />
            </Field>
            <Field label="Location">
              <Input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="h-10 bg-muted/30" />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Link href={ROUTES.suppliers.root}>
            <PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton>
          </Link>

          <PrimaryButton type="submit" className="p-5" disabled={isSubmitting}>
            <Save className="w-4 h-4" />
            {isSubmitting ? "Creating..." : "Create Supplier"}
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
