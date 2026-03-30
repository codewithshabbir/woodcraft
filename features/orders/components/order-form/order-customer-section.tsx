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

type OrderCustomerSectionProps = {
  form: UseFormReturn<OrderFormValues>
}

export function OrderCustomerSection({ form }: OrderCustomerSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="h-10" placeholder="Enter customer name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
