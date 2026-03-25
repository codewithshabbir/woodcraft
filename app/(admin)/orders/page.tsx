"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DeleteOrderDialog from "@/components/admin/actions/delete-order-dialog";

// ✅ MATCH WITH ERD + FORM
const initialOrders = [
  {
    id: "#ORD-001",
    customerName: "Ali Khan",
    totalAmount: 45000,
    itemsCount: 2,
    status: "in_progress",
    paymentStatus: "partial",
    deadline: "2025-04-10",
  },
  {
    id: "#ORD-002",
    customerName: "Ahmed Raza",
    totalAmount: 25000,
    itemsCount: 5,
    status: "completed",
    paymentStatus: "paid",
    deadline: "2025-04-05",
  },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");

  const filteredOrders = initialOrders.filter((order) =>
    `${order.customerName} ${order.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage all customer orders
          </p>
        </div>

        <Link href="/orders/new">
          <Button>Create Order</Button>
        </Link>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center w-full max-w-sm rounded-lg border bg-background px-3 h-10 focus-within:ring-2 focus-within:ring-primary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Overview of all active and completed orders
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b">
              <tr className="text-left text-muted-foreground">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Deadline</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-none hover:bg-muted/40 transition"
                  >
                    {/* ORDER */}
                    <td className="p-4 font-semibold text-primary">
                      {order.id}
                    </td>

                    {/* CUSTOMER */}
                    <td className="p-4">{order.customerName}</td>

                    {/* ITEMS */}
                    <td className="p-4 text-muted-foreground">
                      {order.itemsCount} items
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 font-medium">
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* PAYMENT */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.paymentStatus === "paid"
                            ? "bg-primary text-primary-foreground"
                            : order.paymentStatus === "partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* DEADLINE */}
                    <td className="p-4 text-muted-foreground">
                      {order.deadline}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/orders/${order.id.replace("#", "")}`}>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>

                        <Link
                          href={`/orders/${order.id.replace("#", "")}/edit`}
                        >
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>

                        <DeleteOrderDialog orderId={order.id.replace("#", "")} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
