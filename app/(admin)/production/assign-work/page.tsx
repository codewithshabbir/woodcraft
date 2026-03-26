"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  User,
  Package,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  Layers,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { cn } from "@/lib/utils";

// MOCK DATA
const workData = [
  {
    id: "AW-001",
    worker: "Ali",
    material: "Oak Wood",
    quantity: 10,
    deadline: "2026-04-01",
    status: "Pending",
  },
  {
    id: "AW-002",
    worker: "Ahmed",
    material: "Steel Rod",
    quantity: 5,
    deadline: "2026-04-02",
    status: "In Progress",
  },
  {
    id: "AW-003",
    worker: "Ali",
    material: "Pine Wood",
    quantity: 8,
    deadline: "2026-04-03",
    status: "Completed",
  },
];

export default function AssignWorkListPage() {
  const stats = useMemo(() => {
    const total = workData.length;
    const pending = workData.filter((w) => w.status === "Pending").length;
    const progress = workData.filter((w) => w.status === "In Progress").length;

    return { total, pending, progress };
  }, []);

  const handleDelete = (id: string) => {
    const confirmDelete = confirm("Delete this task?");
    if (!confirmDelete) return;

    console.log("Delete:", id);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Assigned Work
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track assigned tasks
          </p>
        </div>

        <Link href="/assign-work/new">
          <PrimaryButton className="p-5">
            + Assign Work
          </PrimaryButton>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-5 flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Tasks
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
                Pending
              </p>
              <h2 className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </h2>
            </div>
            <Calendar className="w-6 h-6 text-yellow-600 opacity-30" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                In Progress
              </p>
              <h2 className="text-2xl font-bold text-blue-600">
                {stats.progress}
              </h2>
            </div>
            <Package className="w-6 h-6 text-blue-600 opacity-30" />
          </CardContent>
        </Card>

      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm min-w-[800px]">

              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                  <th className="p-4 text-[11px] font-bold uppercase">ID</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Worker</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Material</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Qty</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Deadline</th>
                  <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
                  <th className="p-4 text-[11px] font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {workData.map((w) => (
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

                    <td className="p-4">{w.quantity}</td>

                    <td className="p-4 text-muted-foreground">
                      {w.deadline}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "px-3 py-1 text-[11px] font-bold uppercase rounded-full",
                          w.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : w.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        )}
                      >
                        {w.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">

                        <Link href={`/assign-work/${w.id}`}>
                          <PrimaryButton size="sm" className="p-2 h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </PrimaryButton>
                        </Link>

                        <Link href={`/assign-work/${w.id}/edit`}>
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
                          onClick={() => handleDelete(w.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </PrimaryButton>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}