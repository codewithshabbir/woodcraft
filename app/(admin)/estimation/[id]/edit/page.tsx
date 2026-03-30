import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import EstimationForm from "@/features/estimation/components/estimation-form";
import type { EstimationFormValues } from "@/features/estimation/schemas/estimation.schema";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ROUTES } from "@/lib/constants/routes";
import { getEstimate } from "@/services/admin/admin.service";

export default async function EditEstimatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const estimate = await getEstimate(id);

  const initialValues: EstimationFormValues = {
    projectTitle: estimate.project,
    customerName: estimate.customer,
    projectType: "custom-furniture",
    quantity: 1,
    complexity: estimate.complexity.toLowerCase() === "high" ? "high" : estimate.complexity.toLowerCase() === "low" ? "low" : "medium",
    overheadPercent: estimate.overheadPercent ?? 10,
    profitPercent: estimate.profitPercent ?? 15,
    notes: estimate.notes ?? "",
    materials: [{ id: 1, materialId: "MAT-001", quantity: Math.max(1, Math.round((estimate.materials ?? 520) / 520)) }],
    labor: [{ id: 1, roleId: "LAB-001", hours: Math.max(1, Math.round((estimate.labor ?? 950) / 950)) }],
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Estimate</h1>
          <p className="mt-1 text-sm text-muted-foreground">Adjust the quotation inputs before issuing a revised estimate</p>
        </div>
        <Link href={ROUTES.estimation.history}>
          <PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton>
        </Link>
      </div>

      <EstimationForm mode="edit" estimateId={id} initialValues={initialValues} />
    </div>
  );
}
