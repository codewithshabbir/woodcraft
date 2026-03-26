"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle,
  User,
  Package,
  Calendar,
  Eye,
  Layers,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

// MOCK DATA
const completedWork = [
  {
    id: "CW-001",
    worker: "Ali",
    material: "Oak Wood",
    quantity: 10,
    completedAt: "2026-04-01",
  },
  {
    id: "CW-002",
    worker: "Ahmed",
    material: "Steel Rod",
    quantity: 5,
    completedAt: "2026-04-02",
  },
];

export default function CompletedWorkPage() {

  const stats = useMemo(() => {
    const total = completedWork.length;
    const totalQty = completedWork.reduce((acc, w) => acc + w.quantity, 0);

    return { total, totalQty };
  }, []);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Completed Work
        </h1>
        <p className="text-sm text-muted-foreground">
          Track all completed tasks and production output
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Card>
          <CardContent className="p-5 flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Completed Tasks
              </p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </div>
            <Layers className="w-6 h-6 opacity-30" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Quantity
              </p>
              <h2 className="text-2xl font-bold text-green-600">
                {stats.totalQty}
              </h2>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600 opacity-30" />
          </CardContent>
        </Card>

      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Tasks</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm min-w-[800px]">

              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                  <th className="p-4 text-[11px] font-bold uppercase">ID</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Worker</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Material</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Quantity</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Completed At</th>
                  <th className="p-4 text-[11px] font-bold uppercase text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {completedWork.length > 0 ? (
                  completedWork.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-border last:border-none hover:bg-muted/40 transition"
                    >

                      <td className="p-4 text-xs font-mono text-muted-foreground">
                        {w.id}
                      </td>

                      <td className="p-4 font-semibold text-primary">
                        {w.worker}
                      </td>

                      <td className="p-4">{w.material}</td>

                      <td className="p-4 font-bold">
                        {w.quantity}
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {w.completedAt}
                      </td>

                      <td className="p-4 text-right">
                        <Link href={`/assign-work/${w.id}`}>
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
                      colSpan={6}
                      className="p-12 text-center text-muted-foreground italic"
                    >
                      No completed work found
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