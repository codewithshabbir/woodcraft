import OrderForm from "@/features/orders/components/order-form";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ROUTES } from "@/lib/constants/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Replace with service-backed data when order endpoints are available.
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
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Edit Order #{id}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update order details, items, and payment information
          </p>
        </div>
        <Link href={ROUTES.orders.root}>
          <PrimaryButton
            variant="outline"
            className="p-5 border-primary hover:border-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </PrimaryButton>
        </Link>
      </div>

      <OrderForm mode="edit" initialData={order} />
    </div>
  );
}
