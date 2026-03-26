"use client";

import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  // Mock Data (Real app mein yahan fetch use hoga)
  const order = {
    id: orderId,
    customerName: "Ali Khan",
    status: "in_progress",
    totalAmount: 70000,
    paidAmount: 25000,
    deadline: "2026-04-10",
  };

  const remaining = order.totalAmount - order.paidAmount;
  const paymentPercent = (order.paidAmount / order.totalAmount) * 100;

  const steps = ["pending", "in_progress", "completed"];
  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Order Tracking
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-mono font-bold text-foreground">
              {order.id}
            </span>{" "}
            • {order.customerName}
          </p>
        </div>
        <Link href="/orders">
          <PrimaryButton
            variant="outline"
            className="p-5 border-primary hover:border-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </PrimaryButton>
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Valuation",
            val: `Rs. ${order.totalAmount.toLocaleString()}`,
            icon: Package,
            color: "text-primary",
          },
          {
            label: "Amount Paid",
            val: `Rs. ${order.paidAmount.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
          },
          {
            label: "Remaining",
            val: `Rs. ${remaining.toLocaleString()}`,
            icon: Clock,
            color: "text-red-600",
          },
          {
            label: "Target Deadline",
            val: order.deadline,
            icon: CheckCircle,
            color: "text-muted-foreground",
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
                <h2 className={cn("text-xl font-bold mt-1", item.color)}>
                  {item.val}
                </h2>
              </div>
              <item.icon className={cn("w-8 h-8 opacity-20", item.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAYMENT PROGRESS */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-end mb-3">
            <p className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">
              Payment Progress
            </p>
            <span className="text-sm font-bold text-primary">
              {Math.round(paymentPercent)}% Recovered
            </span>
          </div>
          <Progress value={paymentPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* STATUS FLOW */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm font-bold uppercase tracking-tighter text-muted-foreground mb-6">
            Workflow Status
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-tight transition-all border",
                    i <= currentIndex
                      ? "bg-primary border-primary text-primary-foreground shadow-md"
                      : "bg-muted border-transparent text-muted-foreground",
                  )}
                >
                  {s.replace("_", " ")}
                </div>
                {i !== steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 md:w-12 rounded-full",
                      i < currentIndex ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm font-bold uppercase tracking-tighter text-muted-foreground mb-8">
            Order History
          </p>
          <div className="relative pl-8 space-y-10">
            <div className="absolute left-3.75 top-2 w-0.5 h-[calc(100%-12px)] bg-muted" />
            {[
              {
                label: "Order Confirmed",
                date: "2026-04-01",
                desc: "Initial deposit logged.",
              },
              {
                label: "Production Started",
                date: "2026-04-03",
                desc: "Wood cutting initiated.",
              },
              {
                label: "Quality Check",
                date: "Pending",
                desc: "Awaiting completion.",
              },
            ].map((event, i) => (
              <div key={i} className="relative group">
                <div
                  className={cn(
                    "absolute -left-5.5 top-1 w-3.5 h-3.5 rounded-full border-2 border-background ring-2",
                    event.date !== "Pending"
                      ? "bg-primary ring-primary/20"
                      : "bg-muted ring-muted/20",
                  )}
                />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-sm block">
                      {event.label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.desc}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-muted px-2 py-1 rounded text-muted-foreground">
                    {event.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
