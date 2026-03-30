import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrderFormValues } from "@/features/orders/schemas/order-form.schema"
import type { UseFormReturn } from "react-hook-form"
import { formatNumber } from "@/lib/format";

type OrderStatusSectionProps = {
  form: UseFormReturn<OrderFormValues>
  totalAmount: number
}

export function OrderStatusSection({ form, totalAmount }: OrderStatusSectionProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="h-10 w-full rounded-md border border-border bg-muted px-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="h-10 w-full rounded-md border border-border bg-muted px-2"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg border border-border bg-muted p-3">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">Rs. {formatNumber(totalAmount)}</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}