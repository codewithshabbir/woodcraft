"use client";

import { useMemo, useState, ChangeEvent } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Phone,
  MapPin,
  User,
  Eye,
  Pencil,
  Trash2,
  Layers,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { cn } from "@/lib/utils";

// MOCK DATA
const initialSuppliers = [
  {
    id: "SUP-001",
    name: "ABC Traders",
    phone: "+92 300 1234567",
    location: "Karachi",
    materials: 5,
  },
  {
    id: "SUP-002",
    name: "Wood Masters",
    phone: "+92 311 9876543",
    location: "Lahore",
    materials: 3,
  },
];

type Supplier = typeof initialSuppliers[number];

export default function SuppliersPage() {
  const [search, setSearch] = useState("");

  // FILTER
  const filtered = useMemo(() => {
    return initialSuppliers.filter((s) =>
      `${s.name} ${s.phone} ${s.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  // STATS
  const stats = useMemo(() => {
    const total = filtered.length;
    const totalMaterials = filtered.reduce((acc, s) => acc + s.materials, 0);

    return { total, totalMaterials };
  }, [filtered]);

  const handleDelete = (id: string) => {
    const confirmDelete = confirm("Delete this supplier?");
    if (!confirmDelete) return;

    console.log("Delete:", id);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage all your suppliers
          </p>
        </div>

        <PrimaryButton className="flex items-center gap-2 p-5">
          <Plus className="w-4 h-4" />
          Add Supplier
        </PrimaryButton>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-border shadow-sm hover:shadow-md transition">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Suppliers
              </p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </div>
            <Layers className="w-6 h-6 opacity-30" />
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm hover:shadow-md transition">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Materials
              </p>
              <h2 className="text-2xl font-bold text-primary">
                {stats.totalMaterials}
              </h2>
            </div>
            <Layers className="w-6 h-6 opacity-30 text-primary" />
          </CardContent>
        </Card>
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

      {/* TABLE */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm min-w-[800px]">

              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                  <th className="p-4 text-[11px] font-bold uppercase">
                    Name
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase">
                    Phone
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase">
                    Location
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase">
                    Materials
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-border last:border-none hover:bg-muted/40 transition"
                    >
                      <td className="p-4 font-semibold text-primary whitespace-nowrap">
                        {s.name}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {s.phone}
                      </td>

                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {s.location}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {s.materials}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">

                          <Link href={`/suppliers/${s.id}`}>
                            <PrimaryButton size="sm" className="p-2 h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </PrimaryButton>
                          </Link>

                          <Link href={`/suppliers/${s.id}/edit`}>
                            <PrimaryButton
                              size="sm"
                              variant="secondary"
                              className="p-2 h-8 w-8"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </PrimaryButton>
                          </Link>

                          <PrimaryButton
                            size="sm"
                            variant="destructive"
                            className="p-2 h-8 w-8"
                            onClick={() => handleDelete(s.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </PrimaryButton>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-12 text-center text-muted-foreground italic"
                    >
                      No suppliers found
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