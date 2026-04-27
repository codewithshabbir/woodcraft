"use client";

import Link from "next/link";
import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, Pencil, Plus, Trash2, Users } from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { StatusMessage } from "@/components/shared/status-message";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeleteDialog from "@/components/shared/confirm-delete-dialog";
import PageHeader from "@/components/shared/page-header";
import SearchInput from "@/components/shared/search-input";
import StatCard from "@/components/shared/stat-card";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { listCustomers } from "@/services/admin/admin.service";

function CustomersPageContent() {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const loadCustomers = useCallback(() => listCustomers(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadCustomers });

  const customers = useMemo(() => data ?? [], [data]);
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) =>
      `${customer.name} ${customer.phone} ${customer.email ?? ""} ${customer.id}`.toLowerCase().includes(query),
    );
  }, [customers, search]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        description="Register and maintain customer records used for order creation"
        action={
          <Link href={ROUTES.customers.new}>
            <PrimaryButton className="p-5">
              <Plus className="h-4 w-4" />
              Add Customer
            </PrimaryButton>
          </Link>
        }
      />

      {message ? <StatusMessage type="success" message={message} /> : null}
      {isLoading ? <LoadingState title="Loading customers..." /> : null}
      {!isLoading && error ? (
        <ErrorState title="Customers could not be loaded" description={error} actionLabel="Retry" onAction={reload} />
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Total Customers" value={filteredCustomers.length} icon={Users} color="text-primary" />
            <StatCard
              label="Customers With Email"
              value={filteredCustomers.filter((customer) => Boolean(customer.email)).length}
              icon={Users}
              color="text-sky-600"
            />
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by customer name, phone, email, or ID..."
                className="w-full max-w-md"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>Customer profiles available for order creation and billing</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredCustomers.length === 0 ? (
                <EmptyState
                  title="No customers found"
                  description="Create a customer record before placing a linked order."
                  className="min-h-[220px] rounded-none border-0"
                />
              ) : (
                <div className="w-full overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[820px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                        <th className="p-4 text-[11px] font-bold uppercase">Customer</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Phone</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Email</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Address</th>
                        <th className="p-4 text-right text-[11px] font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                          <td className="p-4">
                            <p className="font-semibold text-primary">{customer.name}</p>
                            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{customer.id}</p>
                          </td>
                          <td className="p-4 whitespace-nowrap">{customer.phone}</td>
                          <td className="p-4 whitespace-nowrap">{customer.email || "-"}</td>
                          <td className="p-4">{customer.address || "-"}</td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <Link href={ROUTES.customers.detail(customer.id)}>
                                <PrimaryButton size="sm" className="h-8 w-8 p-2">
                                  <Eye className="h-4 w-4" />
                                </PrimaryButton>
                              </Link>
                              <Link href={ROUTES.customers.edit(customer.id)}>
                                <PrimaryButton size="sm" variant="secondary" className="h-8 w-8 p-2">
                                  <Pencil className="h-4 w-4" />
                                </PrimaryButton>
                              </Link>
                              <ConfirmDeleteDialog
                                itemId={customer.id}
                                entityType="customer"
                                entityLabel="customer"
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

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <CustomersPageContent />
    </Suspense>
  );
}
