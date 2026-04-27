"use client";

import { use, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { getRawMaterial, updateRawMaterial } from "@/services/admin/admin.service";
import { useAsyncResource } from "@/hooks/use-async-resource";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type MaterialForm = {
  name: string;
  unit: string;
  pricePerUnit: number;
  quantity: number;
  threshold: number;
};

export default function EditMaterialPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const loadMaterial = useState(() => () => getRawMaterial(id))[0];
  const { data: material, error, isLoading } = useAsyncResource({ loader: loadMaterial });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<MaterialForm | null>(null);

  useEffect(() => {
    if (!material) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      name: material.name,
      unit: material.unit,
      pricePerUnit: material.pricePerUnit,
      quantity: material.quantity,
      threshold: material.threshold,
    });
  }, [material]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => prev ? ({
      ...prev,
      [name]: name === "pricePerUnit" || name === "quantity" || name === "threshold" ? Number(value) : value,
    }) : prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await updateRawMaterial(id, {
        name: formData.name,
        unit: formData.unit,
        pricePerUnit: formData.pricePerUnit,
        quantity: formData.quantity,
        threshold: formData.threshold,
      });

      router.push(`${ROUTES.inventory.rawMaterials.root}?message=${encodeURIComponent(result.message)}`);
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Material could not be updated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !formData) {
    return <div className="max-w-5xl mx-auto text-sm text-muted-foreground">Loading material...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Edit Material</h1>
          <p className="text-sm text-muted-foreground">Update material details</p>
        </div>

        <Link href={ROUTES.inventory.rawMaterials.detail(id)}>
          <PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary">
            <ArrowLeft className="w-4 h-4" /> Back
          </PrimaryButton>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error ? <StatusMessage type="error" message={error} /> : null}
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}

        <Card>
          <CardHeader><CardTitle>Material Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Unit" name="unit" value={formData.unit} onChange={handleChange} />
            <InputField label="Price per Unit" name="pricePerUnit" type="number" value={formData.pricePerUnit} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quantity Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
            <InputField label="Threshold" name="threshold" type="number" value={formData.threshold} onChange={handleChange} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={ROUTES.inventory.rawMaterials.detail(id)}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link>
          <PrimaryButton type="submit" className="flex items-center gap-2 p-5" disabled={isSubmitting}><Save className="w-4 h-4" />{isSubmitting ? "Saving..." : "Save Changes"}</PrimaryButton>
        </div>
      </form>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  name: keyof MaterialForm;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

function InputField({ label, name, value, onChange, type = "text" }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input name={name} type={type} value={value} onChange={onChange} className="h-10" />
    </div>
  );
}


