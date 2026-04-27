"use client";

import * as React from "react";

import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusMessage } from "@/components/shared/status-message";
import { listEmployees, listRawMaterials } from "@/services/admin/admin.service";

type MaterialLine = { id: number; materialId: string; quantityUsed: number };
type LaborLine = { id: number; employeeId: string; hours: number };

type EstimateResult = {
  materialCost: number;
  laborCost: number;
  totalCost: number;
  materialBreakdown: Array<{ materialId: string; name: string; quantityUsed: number; unitPrice: number; lineTotal: number }>;
  laborBreakdown: Array<{ employeeId: string; name: string; hours: number; hourlyRate: number; lineTotal: number }>;
};

export default function EstimationForm() {
  const [materials, setMaterials] = React.useState<Array<{ id: string; name: string; unit: string; pricePerUnit: number }>>([]);
  const [employees, setEmployees] = React.useState<Array<{ id: string; name: string; employeeType: string; hourlyRate: number }>>([]);

  const [materialLines, setMaterialLines] = React.useState<MaterialLine[]>([{ id: 1, materialId: "", quantityUsed: 1 }]);
  const [laborLines, setLaborLines] = React.useState<LaborLine[]>([{ id: 1, employeeId: "", hours: 1 }]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<EstimateResult | null>(null);

  React.useEffect(() => {
    let active = true;
    Promise.all([listRawMaterials(), listEmployees()])
      .then(([rawMaterials, employeeRows]) => {
        if (!active) return;
        setMaterials(rawMaterials.map((m) => ({ id: m.id, name: m.name, unit: m.unit, pricePerUnit: m.pricePerUnit })));
        setEmployees(employeeRows.map((e) => ({ id: e.id, name: e.name, employeeType: e.employeeType, hourlyRate: e.hourlyRate })));
      })
      .catch((err) => {
        console.error("[estimation] failed to load lists", err);
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load estimation data.");
      });
    return () => {
      active = false;
    };
  }, []);

  const addMaterialLine = () => {
    setMaterialLines((prev) => [...prev, { id: Date.now(), materialId: "", quantityUsed: 1 }]);
  };
  const removeMaterialLine = (id: number) => {
    setMaterialLines((prev) => (prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)));
  };
  const addLaborLine = () => {
    setLaborLines((prev) => [...prev, { id: Date.now(), employeeId: "", hours: 1 }]);
  };
  const removeLaborLine = (id: number) => {
    setLaborLines((prev) => (prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)));
  };

  const calculate = async () => {
    setError(null);
    setIsSubmitting(true);
    setResult(null);

    try {
      const payload = {
        materialsUsed: materialLines
          .filter((row) => row.materialId && Number(row.quantityUsed) > 0)
          .map((row) => ({ materialId: row.materialId, quantityUsed: Number(row.quantityUsed) })),
        labor: laborLines
          .filter((row) => row.employeeId && Number(row.hours) > 0)
          .map((row) => ({ employeeId: row.employeeId, hours: Number(row.hours) })),
      };

      const res = await fetch("/api/cost-estimation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to calculate estimation.");
      }
      setResult(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to calculate estimation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error ? <StatusMessage type="error" message={error} /> : null}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Materials</CardTitle>
          <CardDescription>Select materials and quantities to estimate material cost.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {materialLines.map((row) => (
            <div key={row.id} className="grid gap-3 md:grid-cols-[1fr_140px_120px]">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Material</Label>
                <select
                  className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"
                  value={row.materialId}
                  onChange={(e) => setMaterialLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, materialId: e.target.value } : r)))}
                >
                  <option value="">Select material</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.unit}) - Rs. {m.pricePerUnit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  className="h-10"
                  min={0}
                  value={row.quantityUsed}
                  onChange={(e) => setMaterialLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, quantityUsed: Number(e.target.value) } : r)))}
                />
              </div>
              <div className="flex items-end gap-2">
                <PrimaryButton type="button" variant="outline" onClick={() => removeMaterialLine(row.id)}>
                  Remove
                </PrimaryButton>
              </div>
            </div>
          ))}
          <PrimaryButton type="button" variant="secondary" onClick={addMaterialLine}>
            Add Material
          </PrimaryButton>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Labor</CardTitle>
          <CardDescription>Select employees and estimated hours to estimate labor cost.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {laborLines.map((row) => (
            <div key={row.id} className="grid gap-3 md:grid-cols-[1fr_140px_120px]">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Employee</Label>
                <select
                  className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"
                  value={row.employeeId}
                  onChange={(e) => setLaborLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, employeeId: e.target.value } : r)))}
                >
                  <option value="">Select employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.employeeType || "employee"}) - Rs. {e.hourlyRate}/hr
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Hours</Label>
                <Input
                  type="number"
                  className="h-10"
                  min={0}
                  value={row.hours}
                  onChange={(e) => setLaborLines((prev) => prev.map((r) => (r.id === row.id ? { ...r, hours: Number(e.target.value) } : r)))}
                />
              </div>
              <div className="flex items-end gap-2">
                <PrimaryButton type="button" variant="outline" onClick={() => removeLaborLine(row.id)}>
                  Remove
                </PrimaryButton>
              </div>
            </div>
          ))}
          <PrimaryButton type="button" variant="secondary" onClick={addLaborLine}>
            Add Labor
          </PrimaryButton>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <PrimaryButton type="button" className="p-5" disabled={isSubmitting} onClick={calculate}>
          {isSubmitting ? "Calculating..." : "Calculate Estimation"}
        </PrimaryButton>
      </div>

      {result ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Estimation Result</CardTitle>
            <CardDescription>Material + labor estimation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-md border border-border p-4">
                <p className="text-muted-foreground">Material Cost</p>
                <p className="text-lg font-bold">Rs. {result.materialCost}</p>
              </div>
              <div className="rounded-md border border-border p-4">
                <p className="text-muted-foreground">Labor Cost</p>
                <p className="text-lg font-bold">Rs. {result.laborCost}</p>
              </div>
              <div className="rounded-md border border-border p-4">
                <p className="text-muted-foreground">Total</p>
                <p className="text-lg font-bold">Rs. {result.totalCost}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
