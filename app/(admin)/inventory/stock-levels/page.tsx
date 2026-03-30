"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Pencil,
  Trash2,
  Eye,
  Layers,
  Search,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import ConfirmDeleteDialog from "@/features/admin/components/shared/confirm-delete-dialog";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import { formatNumber } from "@/lib/format";

// MOCK DATA
const materials = [
  {
    id: "MAT-001",
    name: "Oak Wood",
    category: "Wood",
    stock: 120,
    threshold: 50,
    unit: "ft",
    costPerUnit: 500,
  },
  {
    id: "MAT-002",
    name: "Pine Wood",
    category: "Wood",
    stock: 10,
    threshold: 25,
    unit: "ft",
    costPerUnit: 300,
  },
  {
    id: "MAT-003",
    name: "Steel Rod",
    category: "Metal",
    stock: 0,
    threshold: 20,
    unit: "kg",
    costPerUnit: 700,
  },
];

export default function StockLevelPage() {
  const [search, setSearch] = useState("");

  const processed = useMemo(() => {
    return materials.map((m) => {
      const isOut = m.stock === 0;
      const isLow = m.stock <= m.threshold && m.stock > 0;

      return {
        ...m,
        status: isOut ? "Out" : isLow ? "Low" : "OK",
      };
    });
  }, []);

  const stats = useMemo(() => {
    const total = processed.length;
    const low = processed.filter((m) => m.status === "Low").length;
    const out = processed.filter((m) => m.status === "Out").length;

    return { total, low, out };
  }, [processed]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Stock Level</h1>
        <p className="text-sm text-muted-foreground">
          Monitor inventory levels and alerts
        </p>
      </div>

      {/* STATS (same style as your pages) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Materials",
            val: stats.total,
            icon: Layers,
            color: "text-primary",
          },
          {
            label: "Low Stock",
            val: stats.low,
            icon: AlertTriangle,
            color: "text-yellow-600",
          },
          {
            label: "Out of Stock",
            val: stats.out,
            icon: AlertTriangle,
            color: "text-red-600",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="rounded-xl border border-border shadow-sm hover:shadow-md transition"
          >
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  {item.label}
                </p>
                <h2 className={cn("text-2xl font-bold", item.color)}>
                  {item.val}
                </h2>
              </div>
              <item.icon className={cn("w-6 h-6 opacity-30", item.color)} />
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
                placeholder="Search by material name, category, or stock status..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          <div className="rounded-md border border-border overflow-hidden">
            <div className="w-full overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm min-w-200">
                <thead>
                  <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                    <th className="p-4 text-[11px] font-bold uppercase">
                      Material
                    </th>
                    <th className="p-4 text-[11px] font-bold uppercase">
                      Category
                    </th>
                    <th className="p-4 text-[11px] font-bold uppercase">
                      Stock
                    </th>
                    <th className="p-4 text-[11px] font-bold uppercase">
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
                  {processed.length > 0 ? (
                    processed.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-border last:border-none hover:bg-muted/40 transition"
                      >
                        <td className="p-4 font-semibold text-primary whitespace-nowrap">
                          {m.name}
                        </td>

                        <td className="p-4 text-muted-foreground whitespace-nowrap">
                          {m.category}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "font-bold",
                              m.status === "Out" && "text-red-600",
                              m.status === "Low" && "text-yellow-600",
                            )}
                          >
                            {m.stock} {m.unit}
                          </span>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          Rs. {formatNumber(m.costPerUnit)}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              "px-3 py-1 text-[11px] font-bold uppercase rounded-full",
                              m.status === "Out"
                                ? "bg-red-100 text-red-700"
                                : m.status === "Low"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700",
                            )}
                          >
                            {m.status}
                          </span>
                        </td>

                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            {/* VIEW */}
                            <Link href={ROUTES.inventory.rawMaterials.detail(m.id)}>
                              <PrimaryButton size="sm" className="h-8 w-8 p-2">
                                <Eye className="h-4 w-4" />
                              </PrimaryButton>
                            </Link>

                            {/* EDIT */}
                            <Link href={ROUTES.inventory.rawMaterials.edit(m.id)}>
                              <PrimaryButton
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-2"
                              >
                                <Pencil className="h-4 w-4" />
                              </PrimaryButton>
                            </Link>

                            {/* DELETE */}
                            <ConfirmDeleteDialog
                              itemId={m.id}
                              entityLabel="material"
                              entityType="rawMaterial"
                              trigger={
                                <PrimaryButton
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 w-8 p-2"
                                >
                                  <Trash2 className="h-4 w-4" />
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
                        colSpan={6}
                        className="p-12 text-center text-muted-foreground italic"
                      >
                        No materials found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



