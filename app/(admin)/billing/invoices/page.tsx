"use client";

import { useCallback, useMemo, useState } from "react";
import { CircleDollarSign, FileSpreadsheet, Wallet } from "lucide-react";

import PageHeader from "@/components/shared/page-header";
import SearchInput from "@/components/shared/search-input";
import StatCard from "@/components/shared/stat-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvoicesTable from "@/features/billing/invoices-table";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { listInvoices } from "@/services/admin/admin.service";
import { formatNumber } from "@/lib/format";

export default function BillingInvoicesPage() {
  const [search, setSearch] = useState("");
  const loadInvoices = useCallback(() => listInvoices(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadInvoices });

  const invoices = useMemo(() => data ?? [], [data]);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return invoices;
    }

    return invoices.filter((invoice) =>
      `${invoice.id} ${invoice.orderId}`.toLowerCase().includes(query),
    );
  }, [invoices, search]);

  const stats = useMemo(() => {
    const totalInvoices = filteredInvoices.length;
    const totalBilled = filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);

    return { totalInvoices, totalBilled };
  }, [filteredInvoices]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invoices"
        description="Review invoices that are generated automatically when orders reach completed status"
      />

      {isLoading ? <LoadingState title="Loading invoices..." /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Invoices could not be loaded"
          description={error}
          actionLabel="Retry"
          onAction={reload}
        />
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Invoices" value={stats.totalInvoices} icon={FileSpreadsheet} color="text-primary" />
            <StatCard label="Total Billed" value={`Rs. ${formatNumber(stats.totalBilled)}`} icon={CircleDollarSign} color="text-sky-600" />
            <StatCard label="Recovered" value="See Payments" icon={Wallet} color="text-emerald-600" />
            <StatCard label="Outstanding" value="See Reports" icon={Wallet} color="text-amber-600" />
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by invoice or order..."
                className="w-full max-w-md"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Invoice Registry</CardTitle>
              <CardDescription>Billing records generated after order completion</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredInvoices.length === 0 ? (
                <EmptyState
                  title="No invoices match this search"
                  description="Try a different invoice number or order ID."
                  className="min-h-[180px] rounded-none border-0"
                />
              ) : (
                <InvoicesTable invoices={filteredInvoices} />
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
