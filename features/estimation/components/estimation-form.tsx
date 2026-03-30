"use client";

import { EstimationSummaryCards } from "@/features/estimation/components/estimation-form/estimation-summary-cards";
import { EstimateSummaryPanel } from "@/features/estimation/components/estimation-form/estimate-summary-panel";
import { LaborBreakdownSection } from "@/features/estimation/components/estimation-form/labor-breakdown-section";
import { MaterialBreakdownSection } from "@/features/estimation/components/estimation-form/material-breakdown-section";
import { ProjectDetailsSection } from "@/features/estimation/components/estimation-form/project-details-section";
import { useEstimationForm } from "@/features/estimation/hooks/use-estimation-form";
import type { EstimationFormValues } from "@/features/estimation/schemas/estimation.schema";

type EstimationFormProps = {
  mode?: "create" | "edit";
  estimateId?: string;
  initialValues?: EstimationFormValues;
};

export default function EstimationForm({ mode = "create", estimateId, initialValues }: EstimationFormProps) {
  const {
    values,
    submitError,
    submitSuccess,
    isSubmitting,
    materialRows,
    laborRows,
    materialSubtotal,
    laborSubtotal,
    complexityMultiplier,
    overheadAmount,
    profitAmount,
    unitEstimate,
    totalEstimate,
    setField,
    updateMaterial,
    updateLabor,
    addMaterialLine,
    addLaborLine,
    removeMaterialLine,
    removeLaborLine,
    saveDraft,
  } = useEstimationForm({ mode, estimateId, initialValues });

  const adjustedBase = (materialSubtotal + laborSubtotal) * complexityMultiplier;

  return (
    <div className="space-y-8">
      <EstimationSummaryCards
        materialSubtotal={materialSubtotal}
        laborSubtotal={laborSubtotal}
        unitEstimate={unitEstimate}
        totalEstimate={totalEstimate}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <ProjectDetailsSection values={values} onFieldChange={setField} />
          <MaterialBreakdownSection
            rows={materialRows}
            totalRows={values.materials.length}
            onAddLine={addMaterialLine}
            onRemoveLine={removeMaterialLine}
            onUpdateLine={updateMaterial}
          />
          <LaborBreakdownSection
            rows={laborRows}
            totalRows={values.labor.length}
            onAddLine={addLaborLine}
            onRemoveLine={removeLaborLine}
            onUpdateLine={updateLabor}
          />
        </div>

        <div className="space-y-6">
          <EstimateSummaryPanel
            complexityMultiplier={complexityMultiplier}
            materialSubtotal={materialSubtotal}
            laborSubtotal={laborSubtotal}
            adjustedBase={adjustedBase}
            overheadPercent={values.overheadPercent}
            profitPercent={values.profitPercent}
            overheadAmount={overheadAmount}
            profitAmount={profitAmount}
            quantity={values.quantity}
            unitEstimate={unitEstimate}
            totalEstimate={totalEstimate}
            submitError={submitError}
            submitSuccess={submitSuccess}
            isSubmitting={isSubmitting}
            onOverheadChange={(value) => setField("overheadPercent", value)}
            onProfitChange={(value) => setField("profitPercent", value)}
            onSaveDraft={saveDraft}
          />
        </div>
      </div>
    </div>
  );
}
