"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Briefcase,
  Clock3,
  DollarSign,
  FileText,
  Package,
  TriangleAlert,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

const stats = [
  { label: "Active Orders", value: 18, note: "6 due this week", icon: Package, color: "text-primary" },
  { label: "Monthly Revenue", value: "Rs. 9,85,000", note: "12% above last month", icon: DollarSign, color: "text-emerald-600" },
  { label: "Low Stock Alerts", value: 7, note: "3 urgent materials", icon: TriangleAlert, color: "text-amber-600" },
  { label: "Active Workers", value: 14, note: "11 on assigned jobs", icon: Users, color: "text-sky-600" },
];

const recentOrders = [
  { id: "ORD-104", customer: "Ayesha Interiors", type: "Office Cabinets", value: 185000, status: "In Progress", deadline: "2026-04-05" },
  { id: "ORD-103", customer: "Imran Khan", type: "Dining Set", value: 92000, status: "Pending", deadline: "2026-04-01" },
  { id: "ORD-102", customer: "Nova Studio", type: "Reception Desk", value: 136000, status: "Completed", deadline: "2026-03-28" },
];

const materialAlerts = [
  { name: "Pine Wood", stock: "10 ft", reorder: "25 ft", severity: "critical" },
  { name: "Wood Polish", stock: "3 litre", reorder: "8 litre", severity: "warning" },
  { name: "Drawer Channels", stock: "12 sets", reorder: "15 sets", severity: "warning" },
];

const workerLoad = [
  { name: "Ali Raza", role: "Senior Carpenter", utilization: 92, jobs: 4 },
  { name: "Sajid Iqbal", role: "Finishing Worker", utilization: 76, jobs: 3 },
  { name: "Usman Tariq", role: "Installer", utilization: 61, jobs: 2 },
];

const quickLinks = [
  { title: "Create Order", description: "Register a new customer order and assign products.", href: "/orders/new", icon: Package },
  { title: "Create Estimate", description: "Prepare pricing before confirming a project.", href: "/estimation/new", icon: FileText },
  { title: "Assign Work", description: "Allocate craftsmen and track delivery targets.", href: "/production/assign-work", icon: Briefcase },
  { title: "Raw Materials", description: "Check stock value, low-stock items, and unit costs.", href: "/inventory/raw-materials", icon: Boxes },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time snapshot of orders, inventory, labor activity, and billing
          </p>
        </div>

        <Link href={ROUTES.dashboard.analytics}>
          <PrimaryButton className="p-5">
            View Analytics
            <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="rounded-xl border border-border shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <h2 className={cn("mt-1 text-2xl font-bold", item.color)}>{item.value}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
              </div>
              <item.icon className={cn("h-8 w-8 opacity-20", item.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Current order pipeline and nearest delivery commitments</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="p-4 text-[11px] font-bold uppercase">Order</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Customer</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Project</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Value</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Deadline</th>
                    <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{order.id}</td>
                      <td className="p-4 font-semibold text-primary">{order.customer}</td>
                      <td className="p-4">{order.type}</td>
                      <td className="p-4 font-medium">Rs. {formatNumber(order.value)}</td>
                      <td className="p-4">{order.deadline}</td>
                      <td className="p-4 text-center">
                        <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold uppercase", order.status === "Completed" ? "bg-green-100 text-green-700" : order.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-700")}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used admin tasks across the workshop system</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickLinks.map((item) => (
              <Link key={item.title} href={item.href}>
                <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/20 p-4 transition hover:bg-muted/40">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Materials requiring purchase action before order delays occur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {materialAlerts.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Reorder level: {item.reorder}</p>
                </div>
                <div className="text-right">
                  <p className={cn("font-bold", item.severity === "critical" ? "text-red-600" : "text-amber-600")}>{item.stock}</p>
                  <p className="mt-1 text-xs uppercase text-muted-foreground">In Stock</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Worker Utilization</CardTitle>
            <CardDescription>Current workload spread across assigned craftsmen and installers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {workerLoad.map((worker) => (
              <div key={worker.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{worker.name}</p>
                    <p className="text-muted-foreground">{worker.role} • {worker.jobs} active jobs</p>
                  </div>
                  <span className="font-bold text-primary">{worker.utilization}%</span>
                </div>
                <Progress value={worker.utilization} className="h-2" />
              </div>
            ))}

            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                Weekly Target
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                81% of scheduled workshop hours are already allocated for this week.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
