"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DeleteOrderDialog from "@/components/admin/actions/delete-order-dialog";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { cn } from "@/lib/utils";

// ---------------- MOCK DATA ----------------
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

  // ---------------- FILTER ----------------
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) =>
      `${order.customerName} ${order.id}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  // ---------------- STATS ----------------
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;

    const totalRevenue = filteredOrders.reduce(
      (acc, o) => acc + o.totalAmount,
      0,
    );

    const pendingAmount = filteredOrders
      .filter((o) => o.paymentStatus !== "paid")
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const completedOrders = filteredOrders.filter(
      (o) => o.status === "completed",
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingAmount,
      completedOrders,
    };
  }, [filteredOrders]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>

        <Link href="/orders/new">
          <PrimaryButton className="p-5 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Order
          </PrimaryButton>
        </Link>
      </div>

      {/* ---------------- STATS CARDS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            val: stats.totalOrders,
            icon: Package,
            color: "text-primary",
          },
          {
            label: "Revenue",
            val: `Rs. ${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
          },
          {
            label: "Pending",
            val: `Rs. ${stats.pendingAmount.toLocaleString()}`,
            icon: Clock,
            color: "text-yellow-600",
          },
          {
            label: "Completed",
            val: stats.completedOrders,
            icon: CheckCircle,
            color: "text-green-600",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="rounded-xl border border-border shadow-sm hover:shadow-md transition"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  {item.label}
                </p>
                <h2 className={cn("text-2xl font-bold mt-1", item.color)}>
                  {item.val}
                </h2>
              </div>
              <item.icon className={cn("w-8 h-8 opacity-20", item.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------------- SEARCH ---------------- */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center w-full max-w-md">
            <div className="flex items-center gap-2 w-full rounded-md border border-input bg-muted px-3 h-10 focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search by customer or order ID..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- TABLE ---------------- */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Overview of all active and completed orders
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">
                  Order
                </th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">
                  Customer
                </th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">
                  Items
                </th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">
                  Total
                </th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider text-center">
                  Status
                </th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider text-center">
                  Payment
                </th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">
                  Deadline
                </th>
                <th className="p-4 text-right font-bold uppercase text-[11px] tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-none hover:bg-muted/40 transition"
                  >
                    {/* ORDER ID */}
                    <td className="p-4 font-mono text-[12px] text-muted-foreground">
                      {order.id}
                    </td>

                    {/* CUSTOMER */}
                    <td className="p-4 font-semibold text-primary">
                      {order.customerName}
                    </td>

                    {/* ITEMS */}
                    <td className="p-4 text-muted-foreground font-medium">
                      {order.itemsCount} items
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 font-medium">
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>

                    {/* STATUS */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter shadow-sm
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
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter shadow-sm
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
                        {/* VIEW */}
                        <Link href={`/orders/${order.id.replace("#", "")}`}>
                          <PrimaryButton
                            size="sm"
                            className="p-2 h-8 w-8"
                            title="View Order"
                          >
                            <Eye className="w-4 h-4" />
                          </PrimaryButton>
                        </Link>

                        {/* EDIT */}
                        <Link
                          href={`/orders/${order.id.replace("#", "")}/edit`}
                        >
                          <PrimaryButton
                            size="sm"
                            variant="secondary"
                            className="p-2 h-8 w-8"
                            title="Edit Order"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </PrimaryButton>
                        </Link>

                        {/* DELETE */}
                        <DeleteOrderDialog
                          orderId={order.id.replace("#", "")}
                          trigger={
                            <PrimaryButton
                              size="sm"
                              variant="destructive"
                              className="p-2 h-8 w-8"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </PrimaryButton>
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-muted-foreground italic"
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
