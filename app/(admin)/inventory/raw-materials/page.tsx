"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// ✅ MATCH YOUR SYSTEM
const materials = [
  {
    id: "MAT-001",
    name: "Oak Wood",
    unit: "ft",
    stock: 120,
    costPerUnit: 500,
    status: "in_stock",
  },
  {
    id: "MAT-002",
    name: "Pine Wood",
    unit: "ft",
    stock: 10,
    costPerUnit: 300,
    status: "low_stock",
  },
];

export default function RawMaterialPage() {
  const [search, setSearch] = useState("");

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Raw Materials
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage wood, hardware & stock levels
          </p>
        </div>

        <Button>
          <Plus className="w-4 h-4 mr-1" />
          Add Material
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Materials</p>
            <p className="text-xl font-semibold">{materials.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Low Stock</p>
            <p className="text-xl font-semibold text-yellow-600">
              {materials.filter((m) => m.status === "low_stock").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">In Stock</p>
            <p className="text-xl font-semibold text-green-600">
              {materials.filter((m) => m.status === "in_stock").length}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center w-full max-w-sm rounded-lg border bg-background px-3 h-10 focus-within:ring-2 focus-within:ring-primary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
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
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            All available raw materials
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          <table className="w-full text-sm">

            <thead className="bg-muted/60 border-b">
              <tr className="text-left text-muted-foreground">
                <th className="p-4">Material</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m, i) => (
                <tr
                  key={i}
                  className="border-b last:border-none hover:bg-muted/40"
                >
                  <td className="p-4 font-semibold">{m.name}</td>

                  <td className="p-4">{m.unit}</td>

                  <td className="p-4">{m.stock}</td>

                  <td className="p-4">
                    Rs. {m.costPerUnit.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        m.status === "in_stock"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {m.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </CardContent>
      </Card>

    </div>
  );
}