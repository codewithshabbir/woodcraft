"use client";

import { useMemo, useState, ChangeEvent } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Package,
  Calendar,
  User,
  Eye,
  Layers,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { cn } from "@/lib/utils";

// MOCK DATA
const records = [
  {
    id: "PR-001",
    material: "Oak Wood",
    supplier: "ABC Traders",
    quantity: 50,
    unit: "ft",
    price: 500,
    total: 25000,
    date: "2026-03-20",
  },
  {
    id: "PR-002",
    material: "Steel Rod",
    supplier: "Metal Works",
    quantity: 30,
    unit: "kg",
    price: 700,
    total: 21000,
    date: "2026-03-22",
  },
];

export default function PurchaseRecordsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return records.filter((r) =>
      `${r.material} ${r.supplier} ${r.id}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const stats = useMemo(() => {
    const totalRecords = filtered.length;
    const totalSpent = filtered.reduce((acc, r) => acc + r.total, 0);

    return { totalRecords, totalSpent };
  }, [filtered]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Purchase Records
          </h1>
          <p className="text-sm text-muted-foreground">
            Track all material purchases and supplier transactions
          </p>
        </div>

        <PrimaryButton className="flex items-center gap-2 p-5">
          <Plus className="w-4 h-4" />
          Add Record
        </PrimaryButton>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Records
              </p>
              <h2 className="text-2xl font-bold">{stats.totalRecords}</h2>
            </div>
            <Layers className="w-6 h-6 opacity-30" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Spent
              </p>
              <h2 className="text-2xl font-bold text-primary">
                Rs. {stats.totalSpent.toLocaleString()}
              </h2>
            </div>
            <Package className="w-6 h-6 opacity-30 text-primary" />
          </CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center max-w-md gap-2 border border-input bg-muted/30 px-3 h-10 rounded-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Purchases</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm min-w-[900px]">

              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                  <th className="p-4 text-[11px] font-bold uppercase">ID</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Material</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Supplier</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Qty</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Price</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Total</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Date</th>
                  <th className="p-4 text-[11px] font-bold uppercase text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-border last:border-none hover:bg-muted/40 transition"
                    >

                      <td className="p-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {r.id}
                      </td>

                      <td className="p-4 font-semibold text-primary whitespace-nowrap">
                        {r.material}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {r.supplier}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {r.quantity} {r.unit}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        Rs. {r.price}
                      </td>

                      <td className="p-4 font-bold whitespace-nowrap">
                        Rs. {r.total.toLocaleString()}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {r.date}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <Link href={`/purchase-records/${r.id}`}>
                          <PrimaryButton size="sm" className="p-2 h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </PrimaryButton>
                        </Link>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-12 text-center text-muted-foreground italic"
                    >
                      No records found
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