"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

type SupplierForm = {
  name: string;
  phone: string;
  email: string;
  location: string;
  notes: string;
};

export default function AddSupplierPage() {
  const [formData, setFormData] = useState<SupplierForm>({
    name: "",
    phone: "",
    email: "",
    location: "",
    notes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Supplier:", formData);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Add Supplier
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new supplier profile
          </p>
        </div>

        <Link href="/suppliers">
          <PrimaryButton variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </PrimaryButton>
        </Link>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BASIC INFO */}
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              Basic Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Field label="Supplier Name">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter supplier name"
                className="h-11 bg-muted/30"
              />
            </Field>

            <Field label="Phone">
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92..."
                className="h-11 bg-muted/30"
              />
            </Field>

            <Field label="Email">
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="h-11 bg-muted/30"
              />
            </Field>

            <Field label="Location">
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="h-11 bg-muted/30"
              />
            </Field>

          </CardContent>
        </Card>

        {/* NOTES */}
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              Notes
            </CardTitle>
          </CardHeader>

          <CardContent>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional supplier details..."
              className="w-full h-32 border border-input bg-muted/30 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">

          <Link href="/suppliers">
            <PrimaryButton variant="outline">
              Cancel
            </PrimaryButton>
          </Link>

          <PrimaryButton type="submit" className="gap-2 px-6">
            <Save className="w-4 h-4" />
            Create Supplier
          </PrimaryButton>

        </div>

      </form>
    </div>
  );
}

// 🔹 CLEAN FIELD WRAPPER
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}