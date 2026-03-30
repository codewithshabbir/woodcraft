import { Plus, Trash2 } from "lucide-react"
import type { FieldArrayWithId, UseFormReturn } from "react-hook-form"

import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { OrderFormValues } from "@/features/orders/schemas/order-form.schema"

type OrderItemsSectionProps = {
  form: UseFormReturn<OrderFormValues>
  fields: FieldArrayWithId<OrderFormValues, "items", "id">[]
  onAddItem: () => void
  onRemoveItem: (index: number) => void
}

export function OrderItemsSection({ form, fields, onAddItem, onRemoveItem }: OrderItemsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <div>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Add multiple products for the same customer order</CardDescription>
        </div>

        <PrimaryButton
          type="button"
          variant="outline"
          className="border-primary p-5 hover:border-primary"
          onClick={onAddItem}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </PrimaryButton>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 md:grid-cols-12"
          >
            <div className="md:col-span-3">
              <Input placeholder="Product title" className="h-10" {...form.register(`items.${index}.productTitle`)} />
            </div>
            <div className="md:col-span-2">
              <Input placeholder="Dimensions" className="h-10" {...form.register(`items.${index}.dimensions`)} />
            </div>
            <div className="md:col-span-2">
              <Input placeholder="Material ID" className="h-10" {...form.register(`items.${index}.materialId`)} />
            </div>
            <div className="md:col-span-2">
              <Input
                type="number"
                className="h-10"
                placeholder="Quantity"
                {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                type="number"
                className="h-10"
                placeholder="Unit price"
                {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
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
      </CardContent>
    </Card>
  )
}
