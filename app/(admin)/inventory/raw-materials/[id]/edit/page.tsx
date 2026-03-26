"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

// ✅ TYPES
type PageProps = {
  params: {
    id: string;
  };
};

type MaterialForm = {
  name: string;
  type: string;
  unit: string;
  costPerUnit: number;
  stock: number;
  threshold: number;
  supplierName: string;
  supplierContact: string;
  supplierLocation: string;
  notes: string;
};

export default function EditMaterialPage({ params }: PageProps) {
  const { id } = params;

  const [formData, setFormData] = useState<MaterialForm>({
    name: "Teak Wood",
    type: "Wood",
    unit: "Cubic Feet",
    costPerUnit: 2500,
    stock: 120,
    threshold: 50,
    supplierName: "ABC Traders",
    supplierContact: "+92 300 1234567",
    supplierLocation: "Karachi, Pakistan",
    notes: "High quality imported wood",
  });

  // ✅ HANDLE CHANGE (typed)
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "costPerUnit" ||
        name === "stock" ||
        name === "threshold"
          ? Number(value)
          : value,
    }));
  };

  // ✅ SUBMIT
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Updated Material:", formData);

    // TODO: API call
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Edit Material
          </h1>
          <p className="text-sm text-muted-foreground">
            Update material details
          </p>
        </div>

        <Link href={`/raw-materials/${id}`}>
          <PrimaryButton variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </PrimaryButton>
        </Link>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* MATERIAL INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Material Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Type" name="type" value={formData.type} onChange={handleChange} />
            <InputField label="Unit" name="unit" value={formData.unit} onChange={handleChange} />

            <InputField
              label="Cost per Unit"
              name="costPerUnit"
              type="number"
              value={formData.costPerUnit}
              onChange={handleChange}
            />

          </CardContent>
        </Card>

        {/* STOCK */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InputField
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
            />

            <InputField
              label="Threshold"
              name="threshold"
              type="number"
              value={formData.threshold}
              onChange={handleChange}
            />

          </CardContent>
        </Card>

        {/* SUPPLIER */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InputField label="Supplier Name" name="supplierName" value={formData.supplierName} onChange={handleChange} />
            <InputField label="Contact" name="supplierContact" value={formData.supplierContact} onChange={handleChange} />

            <div className="md:col-span-2">
              <Label>Location</Label>
              <Input
                name="supplierLocation"
                value={formData.supplierLocation}
                onChange={handleChange}
              />
            </div>

          </CardContent>
        </Card>

        {/* NOTES */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-md p-3 text-sm outline-none"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Link href={`/raw-materials/${id}`}>
            <PrimaryButton variant="outline">
              Cancel
            </PrimaryButton>
          </Link>

          <PrimaryButton type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </PrimaryButton>
        </div>

      </form>
    </div>
  );
}

// ✅ REUSABLE INPUT COMPONENT (typed)
type InputFieldProps = {
  label: string;
  name: keyof MaterialForm;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: InputFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}