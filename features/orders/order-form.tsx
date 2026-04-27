"use client";

import { Form } from "@/components/ui/form";
import { StatusMessage } from "@/components/shared/status-message";
import { useOrderForm } from "@/features/orders/use-order-form";
import type { OrderFormValues } from "@/types/ui/forms/order";

import { OrderCustomerSection } from "./order-customer-section";
import { OrderItemsSection } from "./order-items-section";
import { OrderNotesSection } from "./order-notes-section";
import { OrderStatusSection } from "./order-status-section";

type OrderFormProps = {
  mode: "create" | "edit";
  orderId?: string;
  initialData?: Partial<OrderFormValues>;
};

export default function OrderForm({ mode, orderId, initialData }: OrderFormProps) {
  const {
    form,
    fields,
    materials,
    estimatedMaterialCost,
    addMaterial,
    removeMaterial,
    onSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useOrderForm({
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
          {mode === "create" ? <OrderCustomerSection form={form} /> : null}
          <OrderStatusSection mode={mode} form={form} />
        </div>

        {mode === "create" ? (
          <OrderItemsSection
            form={form}
            fields={fields}
            materials={materials}
            estimatedMaterialCost={estimatedMaterialCost}
            onAddItem={addMaterial}
            onRemoveItem={removeMaterial}
          />
        ) : null}

        <OrderNotesSection mode={mode} register={form.register} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
