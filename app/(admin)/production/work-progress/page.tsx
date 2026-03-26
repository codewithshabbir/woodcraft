"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  User,
  Package,
  Calendar,
  Eye,
  Layers,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { cn } from "@/lib/utils";

// MOCK DATA
const progressData = [
  {
    id: "AW-001",
    worker: "Ali",
    material: "Oak Wood",
    quantity: 10,
    completed: 4,
    deadline: "2026-04-01",
  },
  {
    id: "AW-002",
    worker: "Ahmed",
    material: "Steel Rod",
    quantity: 5,
    completed: 3,
    deadline: "2026-04-02",
  },
];

export default function WorkProgressPage() {

  const stats = useMemo(() => {
    const total = progressData.length;

    const avgProgress =
      progressData.reduce(
        (acc, w) => acc + (w.completed / w.quantity) * 100,
        0
      ) / total;

    return {
      total,
      avgProgress: Math.round(avgProgress || 0),
    };
  }, []);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Work Progress
        </h1>
        <p className="text-sm text-muted-foreground">
          Track ongoing work and progress status
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Card>
          <CardContent className="p-5 flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Active Tasks
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
                Avg Progress
              </p>
              <h2 className="text-2xl font-bold text-blue-600">
                {stats.avgProgress}%
              </h2>
            </div>
            <Clock className="w-6 h-6 text-blue-600 opacity-30" />
          </CardContent>
        </Card>

      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Ongoing Work</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm min-w-[900px]">

              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                  <th className="p-4 text-[11px] font-bold uppercase">ID</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Worker</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Material</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Progress</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Deadline</th>
                  <th className="p-4 text-[11px] font-bold uppercase text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {progressData.map((w) => {
                  const percent = Math.round(
                    (w.completed / w.quantity) * 100
                  );

                  return (
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

                      {/* PROGRESS BAR */}
                      <td className="p-4 w-[250px]">
                        <div className="space-y-2">
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all",
                                percent < 40
                                  ? "bg-red-500"
                                  : percent < 80
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              )}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {w.completed} / {w.quantity} ({percent}%)
                          </p>
                        </div>
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {w.deadline}
                      </td>

                      <td className="p-4 text-right">
                        <Link href={`/assign-work/${w.id}`}>
                          <PrimaryButton size="sm" className="p-2 h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </PrimaryButton>
                        </Link>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}