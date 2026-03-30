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
        name: String(formData.get("name") ?? ""),
        type: String(formData.get("type") ?? ""),
        unit: String(formData.get("unit") ?? ""),
        costPerUnit: Number(formData.get("costPerUnit") ?? 0),
        stock: Number(formData.get("stock") ?? 0),
        threshold: Number(formData.get("threshold") ?? 0),
        supplier: {
          name: String(formData.get("supplierName") ?? ""),
          contact: String(formData.get("supplierContact") ?? "N/A"),
          location: String(formData.get("supplierLocation") ?? "N/A"),
        },
        createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        updatedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        notes: String(formData.get("notes") ?? ""),
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
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-primary">Add Raw Material</h1><p className="mt-1 text-sm text-muted-foreground">Create a new inventory item with stock and supplier details</p></div><Link href={ROUTES.inventory.rawMaterials.root}><PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton></Link></div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}
        <Card className="shadow-sm"><CardHeader><CardTitle>Material Information</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-2"><Field label="Material ID"><Input name="id" className="h-10" placeholder="MAT-006" /></Field><Field label="Material Name"><Input name="name" className="h-10" placeholder="Walnut Sheet" /></Field><Field label="Category"><Input name="type" className="h-10" placeholder="Wood" /></Field><Field label="Unit"><Input name="unit" className="h-10" placeholder="sheet" /></Field><Field label="Cost Per Unit"><Input name="costPerUnit" type="number" className="h-10" placeholder="1650" /></Field><Field label="Opening Stock"><Input name="stock" type="number" className="h-10" placeholder="32" /></Field><Field label="Reorder Level"><Input name="threshold" type="number" className="h-10" placeholder="10" /></Field><Field label="Supplier"><Input name="supplierName" className="h-10" placeholder="ABC Traders" /></Field><Field label="Supplier Contact"><Input name="supplierContact" className="h-10" placeholder="+92 300 1234567" /></Field><Field label="Supplier Location"><Input name="supplierLocation" className="h-10" placeholder="Karachi" /></Field></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle>Notes</CardTitle></CardHeader><CardContent><textarea name="notes" className="min-h-[120px] w-full rounded-md border border-border p-3 text-sm outline-none" placeholder="Storage requirements or purchasing notes..." /></CardContent></Card>
        <div className="flex justify-end gap-3"><Link href={ROUTES.inventory.rawMaterials.root}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link><PrimaryButton className="p-5" disabled={isSubmitting}><Save className="h-4 w-4" />{isSubmitting ? "Creating..." : "Create Material"}</PrimaryButton></div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>; }
