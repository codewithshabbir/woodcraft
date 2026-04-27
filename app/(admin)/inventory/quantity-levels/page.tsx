"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Eye, Layers, Pencil, Search, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import ConfirmDeleteDialog from "@/components/shared/confirm-delete-dialog";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { StatusMessage } from "@/components/shared/status-message";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { cn } from "@/lib/helpers";
import { ROUTES } from "@/lib/constants/routes";
import { formatNumber } from "@/lib/format";
import { listRawMaterials } from "@/services/admin/admin.service";

export default function QuantityLevelPage() {
  const [search, setSearch] = useState("");
  const loadMaterials = useCallback(() => listRawMaterials(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadMaterials });

  const processed = useMemo(() => {
    return (data ?? []).map((material) => {
      const isOut = material.quantity === 0;
      const isLow = material.quantity < material.threshold && material.quantity > 0;

      return {
        ...material,
        status: isOut ? "Depleted" : isLow ? "Low" : "OK",
      };
    });
  }, [data]);

  const filtered = useMemo(() => {
    return processed.filter((material) =>
      `${material.name} ${material.id} ${material.status}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [processed, search]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const low = filtered.filter((material) => material.status === "Low").length;
    const out = filtered.filter((material) => material.status === "Out").length;
    return { total, low, out };
  }, [filtered]);

  if (isLoading) return <LoadingState title="Loading quantity levels..." />;
  if (error) return <ErrorState title="Quantity levels could not be loaded" description={error} actionLabel="Retry" onAction={reload} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Quantity Level</h1>
        <p className="text-sm text-muted-foreground">Live raw material quantity levels with threshold-based alerts</p>
      </div>

      {stats.low + stats.out > 0 ? (
        <StatusMessage
          type="error"
          message={`${stats.low + stats.out} material(s) need attention because quantity is low or fully depleted.`}
        />
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Materials", val: stats.total, icon: Layers, color: "text-primary" },
          { label: "Low Quantity", val: stats.low, icon: AlertTriangle, color: "text-yellow-600" },
          { label: "Depleted", val: stats.out, icon: TriangleAlert, color: "text-red-600" },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl border border-border shadow-sm hover:shadow-md transition">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">{item.label}</p>
                <h2 className={cn("text-2xl font-bold", item.color)}>{item.val}</h2>
              </div>
              <item.icon className={cn("w-6 h-6 opacity-30", item.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center w-full max-w-md">
            <div className="flex items-center gap-2 w-full rounded-md border border-input bg-muted px-3 h-10 focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Search by material name, code, or status..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quantity Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div className="w-full overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm min-w-[920px]">
              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30 border-b">
                  <th className="p-4 text-[11px] font-bold uppercase">Material</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Quantity</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Price / Unit</th>
                  <th className="p-4 text-[11px] font-bold uppercase">Threshold</th>
                  <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
                  <th className="p-4 text-[11px] font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((material) => (
                  <tr key={material.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                    <td className="p-4 font-semibold text-primary whitespace-nowrap">{material.name}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "font-bold",
                          material.status === "Depleted" && "text-red-600",
                          material.status === "Low" && "text-yellow-600",
                        )}
                      >
                        {material.quantity} {material.unit}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">Rs. {formatNumber(material.pricePerUnit)}</td>
                    <td className="p-4 whitespace-nowrap">{material.threshold} {material.unit}</td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "px-3 py-1 text-[11px] font-bold uppercase rounded-full",
                          material.status === "Depleted"
                            ? "bg-red-100 text-red-700"
                            : material.status === "Low"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700",
                        )}
                      >
                        {material.status}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <Link href={ROUTES.inventory.rawMaterials.detail(material.id)}>
                          <PrimaryButton size="sm" className="h-8 w-8 p-2">
                            <Eye className="h-4 w-4" />
                          </PrimaryButton>
                        </Link>
                        <Link href={ROUTES.inventory.rawMaterials.edit(material.id)}>
                          <PrimaryButton size="sm" variant="secondary" className="h-8 w-8 p-2">
                            <Pencil className="h-4 w-4" />
                          </PrimaryButton>
                        </Link>
                        <ConfirmDeleteDialog
                          itemId={material.id}
                          entityLabel="material"
                          entityType="rawMaterial"
                          trigger={
                            <PrimaryButton size="sm" variant="destructive" className="h-8 w-8 p-2">
                              <AlertTriangle className="h-4 w-4" />
                            </PrimaryButton>
                          }
                        />
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
