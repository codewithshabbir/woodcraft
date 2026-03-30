"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Layers, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// MOCK DATA
const history = [
  {
    id: 1,
    material: "Oak Wood",
    type: "IN",
    quantity: 50,
    date: "2026-03-20",
    user: "Admin",
  },
  {
    id: 2,
    material: "Pine Wood",
    type: "OUT",
    quantity: 15,
    date: "2026-03-21",
    user: "Manager",
  },
  {
    id: 3,
    material: "Steel Rod",
    type: "OUT",
    quantity: 30,
    date: "2026-03-22",
    user: "Admin",
  },
];

export default function StockHistoryPage() {
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const total = history.length;
    const inCount = history.filter((h) => h.type === "IN").length;
    const outCount = history.filter((h) => h.type === "OUT").length;

    return { total, inCount, outCount };
  }, []);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Stock History</h1>
        <p className="text-sm text-muted-foreground">
          Track all stock movements (in / out)
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow-md transition">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Logs
              </p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </div>
            <Layers className="w-6 h-6 opacity-30" />
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Stock In
              </p>
              <h2 className="text-2xl font-bold text-green-600">
                {stats.inCount}
              </h2>
            </div>
            <ArrowUp className="w-6 h-6 text-green-600 opacity-40" />
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Stock Out
              </p>
              <h2 className="text-2xl font-bold text-red-600">
                {stats.outCount}
              </h2>
            </div>
            <ArrowDown className="w-6 h-6 text-red-600 opacity-40" />
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
                placeholder="Search by material, movement type, or user..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>History Logs</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm min-w-200 shadow-sm">
              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                  <th className="p-4 text-[11px] font-bold uppercase">
                    Material
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase">Type</th>
                  <th className="p-4 text-[11px] font-bold uppercase">
                    Quantity
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase">Date</th>
                  <th className="p-4 text-[11px] font-bold uppercase">User</th>
                </tr>
              </thead>

              <tbody>
                {history.length > 0 ? (
                  history.map((h) => (
                    <tr
                      key={h.id}
                      className="border-b border-border last:border-none hover:bg-muted/40 transition"
                    >
                      <td className="p-4 font-semibold text-primary whitespace-nowrap">
                        {h.material}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-3 py-1 text-[11px] font-bold uppercase rounded-full",
                            h.type === "IN"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700",
                          )}
                        >
                          {h.type}
                        </span>
                      </td>

                      <td className="p-4 font-bold whitespace-nowrap">
                        {h.quantity}
                      </td>

                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {h.date}
                      </td>

                      <td className="p-4 whitespace-nowrap">{h.user}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-12 text-center text-muted-foreground italic"
                    >
                      No history found
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


