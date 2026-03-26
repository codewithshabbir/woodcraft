import OrderForm from "@/components/admin/forms/order-form";

export default function NewOrderPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Create New Order</h1>
          <p className="text-sm text-muted-foreground">
            Add customer details and products to generate a new order
          </p>
        </div>
      </div>
      <OrderForm mode="create" />
    </div>
  );
}
