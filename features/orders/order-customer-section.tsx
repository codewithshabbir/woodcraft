"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import type { OrderFormValues } from "@/types/ui/forms/order";
import type { UseFormReturn } from "react-hook-form";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { listCustomers } from "@/services/admin/admin.service";

type OrderCustomerSectionProps = {
  form: UseFormReturn<OrderFormValues>
}

export function OrderCustomerSection({ form }: OrderCustomerSectionProps) {
  const loadCustomers = useCallback(() => listCustomers(), []);
  const { data } = useAsyncResource({ loader: loadCustomers, initialData: [] });

  const customers = useMemo(() => data ?? [], [data]);
  const selectedCustomerId = form.watch("customerId");
  const selectedCustomer = useMemo(
    () => customers.find((entry) => entry.id === selectedCustomerId) || null,
    [customers, selectedCustomerId],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Customer</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-10 w-full rounded-md border border-border bg-muted px-2"
                  onChange={(event) => {
                    const selectedId = event.target.value;
                    field.onChange(selectedId);
                  }}
                >
                  <option value="">Choose a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.phone})
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
          Selected customer: <span className="font-medium text-foreground">{selectedCustomer?.name || "None"}</span>
        </div>

        <Link href={ROUTES.customers.new}>
          <PrimaryButton type="button" variant="outline" className="border-primary hover:border-primary">
            Register Customer
          </PrimaryButton>
        </Link>
      </CardContent>
    </Card>
  )
}
