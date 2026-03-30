import { Plus, Trash2 } from "lucide-react"

import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatNumber } from "@/lib/format"
import {
  laborOptions,
  type LaborLine,
} from "@/features/estimation/schemas/estimation.schema"

type LaborRow = LaborLine & {
  selectedRole?: (typeof laborOptions)[number]
  lineCost: number
}

type LaborBreakdownSectionProps = {
  rows: LaborRow[]
  totalRows: number
  onAddLine: () => void
  onRemoveLine: (id: number) => void
  onUpdateLine: (id: number, key: keyof Omit<LaborLine, "id">, value: string | number) => void
}

export function LaborBreakdownSection({
  rows,
  totalRows,
  onAddLine,
  onRemoveLine,
  onUpdateLine,
}: LaborBreakdownSectionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Labor Breakdown</CardTitle>
          <CardDescription>Add estimated labor hours and role-based hourly rates</CardDescription>
        </div>
        <PrimaryButton
          type="button"
          variant="outline"
          className="border-primary p-5 hover:border-primary"
          onClick={onAddLine}
        >
          <Plus className="h-4 w-4" />
          Add Labor
        </PrimaryButton>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Worker Role
              </label>
              <select
                value={row.roleId}
                onChange={(event) => onUpdateLine(row.id, "roleId", event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              >
                {laborOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Hours
              </label>
              <Input
                type="number"
                min={0}
                value={row.hours}
                onChange={(event) => onUpdateLine(row.id, "hours", Number(event.target.value))}
                className="h-11"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Rate / Hour
              </label>
              <div className="flex h-11 items-center rounded-md border border-border bg-background px-3 text-sm font-semibold">
                Rs. {formatNumber(row.selectedRole?.ratePerHour ?? 0)}
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

            <div className="md:col-span-12 flex justify-end rounded-lg border border-dashed border-border bg-background px-4 py-3 text-sm font-bold">
              Labor Total: Rs. {formatNumber(row.lineCost)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
