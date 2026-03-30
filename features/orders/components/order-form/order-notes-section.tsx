import { Loader2, Pencil, Plus } from "lucide-react"

import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrderFormValues } from "@/features/orders/schemas/order-form.schema"
import type { UseFormRegister } from "react-hook-form"

type OrderNotesSectionProps = {
  mode: "create" | "edit"
  register: UseFormRegister<OrderFormValues>
  isSubmitting: boolean
}

export function OrderNotesSection({ mode, register, isSubmitting }: OrderNotesSectionProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            placeholder="Add special instructions, delivery notes, or customer requests..."
            {...register("notes")}
            className="min-h-[120px] w-full rounded-md border border-border p-3"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <PrimaryButton type="submit" className="flex items-center gap-2 p-5" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "create" ? (
            <>
              <Plus className="h-4 w-4" />
              Create Order
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Update Order
            </>
          )}
        </PrimaryButton>
      </div>
    </>
  )
}
