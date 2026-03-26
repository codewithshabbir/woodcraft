"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  Pencil,
  Trash2,
  Layers,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DeleteOrderDialog from "@/components/admin/actions/delete-order-dialog";

// ---------------- MOCK DATA ----------------
const initialMaterials = [
  {
    id: "MAT-001",
    name: "Oak Wood",
    category: "Wood",
    unit: "ft",
    stock: 120,
    reorderLevel: 20,
    costPerUnit: 500,
  },
  {
    id: "MAT-002",
    name: "Pine Wood",
    category: "Wood",
    unit: "ft",
    stock: 10,
    reorderLevel: 25,
    costPerUnit: 300,
  },
];

export default function RawMaterialPage() {
  const [search, setSearch] = useState("");

  // ---------------- FILTER ----------------
  const filteredMaterials = useMemo(() => {
    return initialMaterials.filter((m) =>
      `${m.name} ${m.category} ${m.id}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  // ---------------- STATS ----------------
  const stats = useMemo(() => {
    const totalItems = filteredMaterials.length;
    const lowStockCount = filteredMaterials.filter(
      (m) => m.stock < m.reorderLevel,
    ).length;
    const healthyStockCount = totalItems - lowStockCount;
    const totalInventoryValue = filteredMaterials.reduce(
      (acc, m) => acc + m.stock * m.costPerUnit,
      0,
    );

    return {
      totalItems,
      lowStockCount,
      healthyStockCount,
      totalInventoryValue,
    };
  }, [filteredMaterials]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Raw Materials
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor inventory levels, categories, and unit costs
          </p>
        </div>

        <PrimaryButton className="p-5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Material
        </PrimaryButton>
      </div>

      {/* ---------------- STATS CARDS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Materials",
            val: stats.totalItems,
            icon: Layers,
            color: "text-primary",
          },
          {
            label: "Inventory Value",
            val: `Rs. ${stats.totalInventoryValue.toLocaleString()}`,
            icon: Package,
            color: "text-blue-600",
          },
          {
            label: "Low Stock Items",
            val: stats.lowStockCount,
            icon: AlertTriangle,
            color: "text-red-600",
          },
          {
            label: "Healthy Stock",
            val: stats.healthyStockCount,
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
            <div className="flex items-center gap-2 w-full rounded-md border border-input bg-muted px-3 h-10 focus-within:ring-2 focus-within:ring-ring transition-all">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search by name, category or ID..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- TABLE ---------------- */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            Detailed view of your current stock and reorder points
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                  <th className="p-4 text-[11px] font-bold uppercase">ID</th>

                  <th className="p-4 text-[11px] font-bold uppercase">
                    Material
                  </th>

                  <th className="p-4 text-[11px] font-bold uppercase md:table-cell">
                    Category
                  </th>

                  <th className="p-4 text-[11px] font-bold uppercase">Stock</th>

                  <th className="p-4 text-[11px] font-bold uppercase sm:table-cell">
                    Cost
                  </th>

                  <th className="p-4 text-[11px] font-bold uppercase text-center">
                    Status
                  </th>

                  <th className="p-4 text-[11px] font-bold uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((m) => {
                    const isLow = m.stock < m.reorderLevel;

                    return (
                      <tr
                        key={m.id}
                        className="border-b border-border hover:bg-muted/40 transition"
                      >
                        <td className="p-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                          {m.id}
                        </td>

                        <td className="p-4 font-semibold text-primary whitespace-nowrap">
                          {m.name}
                        </td>

                        <td className="p-4 md:table-cell text-muted-foreground whitespace-nowrap">
                          {m.category}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={cn("font-bold", isLow && "text-red-600")}
                          >
                            {m.stock} {m.unit}
                          </span>
                          <span className="ml-1 text-[10px] text-muted-foreground">
                            (Min: {m.reorderLevel})
                          </span>
                        </td>

                        <td className="p-4 sm:table-cell whitespace-nowrap">
                          Rs. {m.costPerUnit.toLocaleString()}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              "px-2 py-1 text-[10px] font-bold rounded-full",
                              isLow
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700",
                            )}
                          >
                            {isLow ? "Low" : "OK"}
                          </span>
                        </td>

                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Link href={`/inventory/raw-materials/${m.id}`}>
                              <PrimaryButton
                                size="sm"
                                className="p-2 h-8 w-8"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </PrimaryButton>
                            </Link>

                            <Link href={`/inventory/raw-materials/${m.id}/edit`}>
                              <PrimaryButton
                                size="sm"
                                variant="secondary"
                                className="p-2 h-8 w-8"
                                title="Edit Material"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </PrimaryButton>
                            </Link>
                            <DeleteOrderDialog
                              orderId={m.id.replace("#", "")}
                              trigger={
                                <PrimaryButton
                                  size="sm"
                                  variant="destructive"
                                  className="p-2 h-8 w-8"
                                  title="Delete Material"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </PrimaryButton>
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-12 text-center text-muted-foreground italic"
                    >
                      No materials found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
