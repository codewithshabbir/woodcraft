"use client";

import Link from "next/link";
import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Layers,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { StatusMessage } from "@/components/shared/status-message";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeleteDialog from "@/features/admin/components/shared/confirm-delete-dialog";
import PageHeader from "@/features/admin/components/shared/page-header";
import SearchInput from "@/features/admin/components/shared/search-input";
import StatCard from "@/features/admin/components/shared/stat-card";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { listRawMaterials } from "@/services/admin/admin.service";
import { formatNumber } from "@/lib/format";

function RawMaterialPageContent() {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const loadRawMaterials = useCallback(() => listRawMaterials(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadRawMaterials });

  const materials = useMemo(() => data ?? [], [data]);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return materials;
    }

    return materials.filter((material) =>
      `${material.name} ${material.type} ${material.id}`.toLowerCase().includes(query),
    );
  }, [materials, search]);

  const stats = useMemo(() => {
    const totalItems = filteredMaterials.length;
    const lowStockCount = filteredMaterials.filter((material) => material.stock < material.threshold).length;
    const healthyStockCount = totalItems - lowStockCount;
    const totalInventoryValue = filteredMaterials.reduce(
      (sum, material) => sum + material.stock * material.costPerUnit,
      0,
    );

    return { totalItems, lowStockCount, healthyStockCount, totalInventoryValue };
  }, [filteredMaterials]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Raw Materials"
        description="Monitor inventory levels, reorder thresholds, and unit costs"
        action={
          <Link href={ROUTES.inventory.rawMaterials.new}>
            <PrimaryButton className="p-5">
              <Plus className="h-4 w-4" />
              Add Material
            </PrimaryButton>
          </Link>
        }
      />

      {message ? <StatusMessage type="success" message={message} /> : null}

      {isLoading ? <LoadingState title="Loading raw materials..." /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Raw materials could not be loaded"
          description="The inventory list is using the mock service layer right now. Retry to restore the screen state."
          actionLabel="Retry"
          onAction={reload}
        />
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Materials" value={stats.totalItems} icon={Layers} color="text-primary" />
            <StatCard
              label="Inventory Value"
              value={`Rs. ${formatNumber(stats.totalInventoryValue)}`}
              icon={Package}
              color="text-sky-600"
            />
            <StatCard label="Low Stock" value={stats.lowStockCount} icon={AlertTriangle} color="text-red-600" />
            <StatCard label="Healthy Stock" value={stats.healthyStockCount} icon={CheckCircle} color="text-emerald-600" />
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by material name, category, or ID..."
                className="w-full max-w-md"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle>Inventory List</CardTitle>
              <CardDescription>Detailed view of current stock, cost, and reorder thresholds</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredMaterials.length === 0 ? (
                <EmptyState
                  title="No materials match this search"
                  description="Try a different material name, category, or code to see matching inventory items."
                  className="min-h-[220px] rounded-none border-0"
                />
              ) : (
                <div className="w-full overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                        <th className="p-4 text-[11px] font-bold uppercase">ID</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Material</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Category</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Stock</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Cost</th>
                        <th className="p-4 text-center text-[11px] font-bold uppercase">Status</th>
                        <th className="p-4 text-right text-[11px] font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaterials.map((material) => {
                        const isLow = material.stock < material.threshold;

                        return (
                          <tr key={material.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                            <td className="p-4 text-xs font-mono text-muted-foreground whitespace-nowrap">{material.id}</td>
                            <td className="p-4 font-semibold text-primary whitespace-nowrap">{material.name}</td>
                            <td className="p-4 whitespace-nowrap text-muted-foreground">{material.type}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={cn("font-bold", isLow ? "text-red-600" : "text-foreground")}>
                                {material.stock} {material.unit}
                              </span>
                              <span className="ml-1 text-[10px] text-muted-foreground">(Min: {material.threshold})</span>
                            </td>
                            <td className="p-4 whitespace-nowrap">Rs. {formatNumber(material.costPerUnit)}</td>
                            <td className="p-4 text-center whitespace-nowrap">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-1 text-[10px] font-bold",
                                  isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
                                )}
                              >
                                {isLow ? "Low" : "OK"}
                              </span>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex justify-end gap-2">
                                <Link href={ROUTES.inventory.rawMaterials.detail(material.id)}>
                                  <PrimaryButton size="sm" className="h-8 w-8 p-2" title="View Details">
                                    <Eye className="h-4 w-4" />
                                  </PrimaryButton>
                                </Link>
                                <Link href={ROUTES.inventory.rawMaterials.edit(material.id)}>
                                  <PrimaryButton size="sm" variant="secondary" className="h-8 w-8 p-2" title="Edit Material">
                                    <Pencil className="h-4 w-4" />
                                  </PrimaryButton>
                                </Link>
                                <ConfirmDeleteDialog
                                  itemId={material.id}
                                  entityLabel="material"
                                  entityType="rawMaterial"
                                  trigger={
                                    <PrimaryButton size="sm" variant="destructive" className="h-8 w-8 p-2" title="Delete Material">
                                      <Trash2 className="h-4 w-4" />
                                    </PrimaryButton>
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}


export default function RawMaterialPage() {
  return (
    <Suspense fallback={null}>
      <RawMaterialPageContent />
    </Suspense>
  )
}