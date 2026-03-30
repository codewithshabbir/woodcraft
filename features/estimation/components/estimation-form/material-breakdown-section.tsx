import { Package, Plus, Trash2 } from "lucide-react"

import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatNumber } from "@/lib/format"
import {
  materialOptions,
  type MaterialLine,
} from "@/features/estimation/schemas/estimation.schema"

type MaterialRow = MaterialLine & {
  selectedMaterial?: (typeof materialOptions)[number]
  lineCost: number
}

type MaterialBreakdownSectionProps = {
  rows: MaterialRow[]
  totalRows: number
  onAddLine: () => void
  onRemoveLine: (id: number) => void
  onUpdateLine: (id: number, key: keyof Omit<MaterialLine, "id">, value: string | number) => void
}

export function MaterialBreakdownSection({
  rows,
  totalRows,
  onAddLine,
  onRemoveLine,
  onUpdateLine,
}: MaterialBreakdownSectionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Material Breakdown</CardTitle>
          <CardDescription>Select raw materials and define expected usage for this estimate</CardDescription>
        </div>
        <PrimaryButton
          type="button"
          variant="outline"
          className="border-primary p-5 hover:border-primary"
          onClick={onAddLine}
        >
          <Plus className="h-4 w-4" />
          Add Material
        </PrimaryButton>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 md:grid-cols-12">
            <div className="md:col-span-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Material
              </label>
              <select
                value={row.materialId}
                onChange={(event) => onUpdateLine(row.id, "materialId", event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              >
                {materialOptions.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quantity
              </label>
              <Input
                type="number"
                min={0}
                value={row.quantity}
                onChange={(event) => onUpdateLine(row.id, "quantity", Number(event.target.value))}
                className="h-11"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Unit Cost
              </label>
              <div className="flex h-11 items-center rounded-md border border-border bg-background px-3 text-sm font-semibold">
                Rs. {formatNumber(row.selectedMaterial?.price ?? 0)}
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Availability
              </label>
              <div className="flex h-11 items-center rounded-md border border-border bg-background px-3 text-sm text-muted-foreground">
                {formatNumber(row.selectedMaterial?.stock ?? 0)} {row.selectedMaterial?.unit ?? "units"} in stock
              </div>
            </div>

            <div className="md:col-span-1 flex items-end">
              <PrimaryButton
                type="button"
                variant="destructive"
                className="h-11 w-full px-0"
                onClick={() => onRemoveLine(row.id)}
                disabled={totalRows === 1}
              >
                <Trash2 className="h-4 w-4" />
              </PrimaryButton>
            </div>

            <div className="md:col-span-12 flex items-center justify-between rounded-lg border border-dashed border-border bg-background px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                {row.selectedMaterial?.id} - {row.selectedMaterial?.unit}
              </div>
              <div className="text-sm font-bold text-foreground">Line Total: Rs. {formatNumber(row.lineCost)}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
