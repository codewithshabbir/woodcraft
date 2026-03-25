import OrderForm from "@/components/admin/forms/order-form";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 🔥 replace with API
  type OrderType = {
  customerName: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
  paymentStatus: "unpaid" | "partial" | "paid";
  items: {
    productTitle: string;
    dimensions: string;
    materialId: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
};

const order: OrderType = {
  customerName: "Ali Khan",
  deadline: "2026-04-10",
  status: "in_progress",
  paymentStatus: "partial",
  items: [
    {
      productTitle: "Dining Table",
      dimensions: "6x3 ft",
      materialId: "1",
      quantity: 2,
      unitPrice: 15000,
    },
  ],
  notes: "Urgent",
};

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-primary">
        Edit Order ({id})
      </h1>

      <OrderForm mode="edit" initialData={order} />
    </div>
  );
}