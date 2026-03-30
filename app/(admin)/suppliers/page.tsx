"use client";

import Link from "next/link";
import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, Layers, Pencil, Plus, Trash2 } from "lucide-react";

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
import { listSuppliers } from "@/services/admin/admin.service";

function SuppliersPageContent() {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const loadSuppliers = useCallback(() => listSuppliers(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadSuppliers });

  const suppliers = useMemo(() => data ?? [], [data]);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return suppliers;
    }

    return suppliers.filter((supplier) =>
      `${supplier.name} ${supplier.phone} ${supplier.location} ${supplier.id}`.toLowerCase().includes(query),
    );
  }, [suppliers, search]);

  const stats = useMemo(() => {
    const totalSuppliers = filteredSuppliers.length;
    const totalMaterials = filteredSuppliers.reduce((sum, supplier) => sum + supplier.materials.length, 0);

    return { totalSuppliers, totalMaterials };
  }, [filteredSuppliers]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Suppliers"
        description="Manage supplier contacts, sourcing locations, and covered materials"
        action={
          <Link href={ROUTES.suppliers.new}>
            <PrimaryButton className="p-5">
              <Plus className="h-4 w-4" />
              Add Supplier
            </PrimaryButton>
          </Link>
        }
      />

      {message ? <StatusMessage type="success" message={message} /> : null}

      {isLoading ? <LoadingState title="Loading suppliers..." /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Suppliers could not be loaded"
          description="The supplier registry is still backed by the mock service layer. Retry to restore the screen state."
          actionLabel="Retry"
          onAction={reload}
        />
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Total Suppliers" value={stats.totalSuppliers} icon={Layers} color="text-primary" />
            <StatCard label="Material Coverage" value={stats.totalMaterials} icon={Layers} color="text-sky-600" />
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by supplier name, phone, location, or ID..."
                className="w-full max-w-md"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>All Suppliers</CardTitle>
              <CardDescription>Supplier master data used across purchasing and restocking workflows</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredSuppliers.length === 0 ? (
                <EmptyState
                  title="No suppliers match this search"
                  description="Try a different supplier name, city, or phone number to see matching records."
                  className="min-h-[220px] rounded-none border-0"
                />
              ) : (
                <div className="w-full overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                        <th className="p-4 text-[11px] font-bold uppercase">Supplier</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Phone</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Location</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Materials</th>
                        <th className="p-4 text-right text-[11px] font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.map((supplier) => (
                        <tr key={supplier.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                          <td className="p-4">
                            <p className="font-semibold text-primary whitespace-nowrap">{supplier.name}</p>
                            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{supplier.id}</p>
                          </td>
                          <td className="p-4 whitespace-nowrap">{supplier.phone}</td>
                          <td className="p-4 whitespace-nowrap text-muted-foreground">{supplier.location}</td>
                          <td className="p-4 whitespace-nowrap">{supplier.materials.length}</td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <Link href={ROUTES.suppliers.detail(supplier.id)}>
                                <PrimaryButton size="sm" className="h-8 w-8 p-2">
                                  <Eye className="h-4 w-4" />
                                </PrimaryButton>
                              </Link>
                              <Link href={ROUTES.suppliers.edit(supplier.id)}>
                                <PrimaryButton size="sm" variant="secondary" className="h-8 w-8 p-2">
                                  <Pencil className="h-4 w-4" />
                                </PrimaryButton>
                              </Link>
                              <ConfirmDeleteDialog
                                itemId={supplier.id}
                                entityLabel="supplier"
                                entityType="supplier"
                                trigger={
                                  <PrimaryButton size="sm" variant="destructive" className="h-8 w-8 p-2">
                                    <Trash2 className="h-4 w-4" />
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
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}



export default function SuppliersPage() {
  return (
    <Suspense fallback={null}>
      <SuppliersPageContent />
    </Suspense>
  )
}