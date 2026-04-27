import { Plus, Trash2 } from "lucide-react"
import type { FieldArrayWithId, UseFormReturn } from "react-hook-form"

import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { OrderFormValues } from "@/types/ui/forms/order"
import { formatNumber } from "@/lib/format"

type OrderItemsSectionProps = {
  form: UseFormReturn<OrderFormValues>
  fields: FieldArrayWithId<OrderFormValues, "materialsUsed", "id">[]
  materials: Array<{ id: string; name: string; pricePerUnit: number }>
  estimatedMaterialCost: number
  onAddItem: () => void
  onRemoveItem: (index: number) => void
}

export function OrderItemsSection({ form, fields, materials, estimatedMaterialCost, onAddItem, onRemoveItem }: OrderItemsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <div>
          <CardTitle>Materials Used</CardTitle>
          <CardDescription>Materials that will be consumed to complete the order</CardDescription>
        </div>

        <PrimaryButton
          type="button"
          variant="outline"
          className="border-primary p-5 hover:border-primary"
          onClick={onAddItem}
        >
          <Plus className="h-4 w-4" />
          Add Material
        </PrimaryButton>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 md:grid-cols-12"
          >
            <div className="md:col-span-6">
              <select
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
                {...form.register(`materialsUsed.${index}.materialId`)}
              >
                <option value="">Select material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} ({material.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-5">
              <Input
                type="number"
                className="h-10"
                placeholder="Quantity"
                {...form.register(`materialsUsed.${index}.quantityUsed`, { valueAsNumber: true })}
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <PrimaryButton
                type="button"
                variant="destructive"
                className="px-4 py-5"
                onClick={() => onRemoveItem(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </PrimaryButton>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/20 p-4 text-sm md:flex-row md:items-center md:justify-between">
          <span className="text-muted-foreground">Estimated material cost</span>
          <span className="font-semibold text-primary">Rs. {formatNumber(estimatedMaterialCost)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
