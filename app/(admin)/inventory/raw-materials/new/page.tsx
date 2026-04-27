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
import { createRawMaterial } from "@/services/admin/admin.service";

export default function NewRawMaterialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await createRawMaterial({
        id: String(formData.get("id") ?? ""),
        name: String(formData.get("name") ?? ""),
        unit: String(formData.get("unit") ?? ""),
        pricePerUnit: Number(formData.get("pricePerUnit") ?? 0),
        quantity: Number(formData.get("quantity") ?? 0),
        threshold: Number(formData.get("threshold") ?? 0),
      });

      router.push(`${ROUTES.inventory.rawMaterials.root}?message=${encodeURIComponent(result.message)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Material could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-primary">Add Raw Material</h1><p className="mt-1 text-sm text-muted-foreground">Create a new inventory item with quantity, pricing, and reorder threshold</p></div><Link href={ROUTES.inventory.rawMaterials.root}><PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton></Link></div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}
        <Card className="shadow-sm"><CardHeader><CardTitle>Material Information</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-2"><Field label="Material ID"><Input name="id" className="h-10" placeholder="MAT-006" /></Field><Field label="Material Name"><Input name="name" className="h-10" placeholder="Walnut Sheet" /></Field><Field label="Unit"><Input name="unit" className="h-10" placeholder="sheet" /></Field><Field label="Price Per Unit"><Input name="pricePerUnit" type="number" className="h-10" placeholder="1650" /></Field><Field label="Quantity"><Input name="quantity" type="number" className="h-10" placeholder="32" /></Field><Field label="Threshold"><Input name="threshold" type="number" className="h-10" placeholder="10" /></Field></CardContent></Card>
        <div className="flex justify-end gap-3"><Link href={ROUTES.inventory.rawMaterials.root}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link><PrimaryButton className="p-5" disabled={isSubmitting}><Save className="h-4 w-4" />{isSubmitting ? "Creating..." : "Create Material"}</PrimaryButton></div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>; }
