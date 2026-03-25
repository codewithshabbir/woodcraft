import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ IMPORTANT
}) {
  // ✅ FIX: await params
  const { id: orderId } = await params;

  const order = {
    id: orderId,
    customerName: "Ali Khan",
    status: "in_progress",
    paymentStatus: "partial",
    totalAmount: 45000,
    paidAmount: 20000,
    deadline: "2026-04-10",
    notes: "Urgent delivery required",
    items: [
      {
        productTitle: "Dining Table",
        dimensions: "6x3 ft",
        materialName: "Oak",
        quantity: 2,
        unitPrice: 15000,
      },
    ],
    timeline: [
      { label: "Order Created", date: "2026-04-01" },
      { label: "Production Started", date: "2026-04-03" },
    ],
  };

  const remaining = order.totalAmount - order.paidAmount;
  const paymentPercent =
    (order.paidAmount / order.totalAmount) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Order Tracking
          </h1>
          <p className="text-sm text-muted-foreground">
            {order.id} • {order.customerName}
          </p>
        </div>

        <Link href="/orders">
          <Button variant="outline">← Back</Button>
        </Link>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-semibold">
            Rs. {order.totalAmount.toLocaleString()}
          </p>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="font-semibold text-green-600">
            Rs. {order.paidAmount.toLocaleString()}
          </p>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p className="font-semibold text-red-600">
            Rs. {remaining.toLocaleString()}
          </p>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Deadline</p>
          <p>{order.deadline}</p>
        </CardContent></Card>
      </div>

      {/* PAYMENT */}
      <Card>
        <CardHeader><CardTitle>Payment Progress</CardTitle></CardHeader>
        <CardContent>
          <Progress value={paymentPercent} />
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(paymentPercent)}% paid
          </p>
        </CardContent>
      </Card>

      {/* STATUS */}
      <Card>
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {["pending", "in_progress", "completed"].map((s) => (
              <div
                key={s}
                className={`px-4 py-2 rounded-md text-sm capitalize
                ${
                  order.status === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {s.replace("_", " ")}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="grid md:grid-cols-6 gap-4 p-4 border rounded-lg">
              <div><p className="text-xs">Product</p><p>{item.productTitle}</p></div>
              <div><p className="text-xs">Size</p><p>{item.dimensions}</p></div>
              <div><p className="text-xs">Material</p><p>{item.materialName}</p></div>
              <div><p className="text-xs">Qty</p><p>{item.quantity}</p></div>
              <div><p className="text-xs">Price</p><p>Rs. {item.unitPrice}</p></div>
              <div><p className="text-xs">Subtotal</p><p className="font-semibold">
                Rs. {(item.quantity * item.unitPrice).toLocaleString()}
              </p></div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <Card>
        <CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {order.timeline.map((event, i) => (
            <div key={i} className="flex justify-between text-sm border-b pb-2">
              <span>{event.label}</span>
              <span className="text-muted-foreground">{event.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}