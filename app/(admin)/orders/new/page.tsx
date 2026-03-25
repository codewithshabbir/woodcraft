import OrderForm from "@/components/admin/forms/order-form";

export default function NewOrderPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-primary">
        Create New Order
      </h1>

      <OrderForm mode="create" />
    </div>
  );
}