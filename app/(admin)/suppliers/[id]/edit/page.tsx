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
import { getSupplier, updateSupplier } from "@/services/admin/admin.service";
import { useAsyncResource } from "@/hooks/use-async-resource";

export default function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const loadSupplier = React.useCallback(() => getSupplier(id), [id]);
  const { data: supplier, error, isLoading } = useAsyncResource({ loader: loadSupplier });
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await updateSupplier(id, {
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        location: String(formData.get("location") ?? ""),
      });

      router.push(`${ROUTES.suppliers.root}?message=${encodeURIComponent(result.message)}`);
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Supplier could not be updated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !supplier) {
    return <div className="mx-auto max-w-5xl text-sm text-muted-foreground">Loading supplier...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-primary">Edit Supplier</h1><p className="mt-1 text-sm text-muted-foreground">Update supplier contact and procurement details</p></div><Link href={ROUTES.suppliers.detail(id)}><PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton></Link></div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? <StatusMessage type="error" message={error} /> : null}
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}
        <Card className="shadow-sm"><CardHeader><CardTitle>Supplier Information</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-2"><Field label="Supplier Name"><Input name="name" className="h-10" defaultValue={supplier.name} /></Field><Field label="Phone"><Input name="phone" className="h-10" defaultValue={supplier.phone} /></Field><Field label="Email"><Input name="email" className="h-10" defaultValue={supplier.email} /></Field><Field label="Location"><Input name="location" className="h-10" defaultValue={supplier.location} /></Field></CardContent></Card>
        <div className="flex justify-end gap-3"><Link href={ROUTES.suppliers.detail(id)}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link><PrimaryButton className="p-5" disabled={isSubmitting}><Save className="h-4 w-4" />{isSubmitting ? "Saving..." : "Save Changes"}</PrimaryButton></div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>; }

