"use client";

import { Form } from "@/components/ui/form";
import { StatusMessage } from "@/components/shared/status-message";
import { useOrderForm } from "@/features/orders/hooks/use-order-form";
import type { OrderFormValues } from "@/features/orders/schemas/order-form.schema";

import { OrderCustomerSection } from "./order-form/order-customer-section";
import { OrderItemsSection } from "./order-form/order-items-section";
import { OrderNotesSection } from "./order-form/order-notes-section";
import { OrderStatusSection } from "./order-form/order-status-section";

type OrderFormProps = {
  mode: "create" | "edit";
  orderId?: string;
  initialData?: Partial<OrderFormValues>;
};

export default function OrderForm({ mode, orderId, initialData }: OrderFormProps) {
  const { form, fields, totalAmount, addItem, removeItem, onSubmit, isSubmitting, submitError, submitSuccess } = useOrderForm({
    mode,
    orderId,
    initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {submitSuccess ? <StatusMessage type="success" message={submitSuccess} /> : null}
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}

        <div className="grid gap-6 md:grid-cols-3">
          <OrderCustomerSection form={form} />
          <OrderStatusSection form={form} totalAmount={totalAmount} />
        </div>

        <OrderItemsSection
          form={form}
          fields={fields}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />

        <OrderNotesSection mode={mode} register={form.register} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
