"use client";

import { useCallback, useMemo, useState } from "react";
import { CircleDollarSign, FileSpreadsheet, Plus, Wallet } from "lucide-react";

import PageHeader from "@/features/admin/components/shared/page-header";
import SearchInput from "@/features/admin/components/shared/search-input";
import StatCard from "@/features/admin/components/shared/stat-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvoicesTable from "@/features/billing/components/invoices-table";
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
      `${invoice.id} ${invoice.orderId} ${invoice.customer}`.toLowerCase().includes(query),
    );
  }, [invoices, search]);

  const stats = useMemo(() => {
    const totalInvoices = filteredInvoices.length;
    const totalBilled = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const totalPaid = filteredInvoices.reduce((sum, invoice) => sum + invoice.paid, 0);
    const outstanding = totalBilled - totalPaid;

    return { totalInvoices, totalBilled, totalPaid, outstanding };
  }, [filteredInvoices]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invoices"
        description="Review billed orders, payment recovery, and due balances"
        action={
          <PrimaryButton className="p-5">
            <Plus className="h-4 w-4" />
            Generate Invoice
          </PrimaryButton>
        }
      />

      {isLoading ? <LoadingState title="Loading invoices..." /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Invoices could not be loaded"
          description="The billing screen is already pointed at a mock service layer, so retry should restore the data flow."
          actionLabel="Retry"
          onAction={reload}
        />
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Invoices" value={stats.totalInvoices} icon={FileSpreadsheet} color="text-primary" />
            <StatCard label="Total Billed" value={`Rs. ${formatNumber(stats.totalBilled)}`} icon={CircleDollarSign} color="text-sky-600" />
            <StatCard label="Recovered" value={`Rs. ${formatNumber(stats.totalPaid)}`} icon={Wallet} color="text-emerald-600" />
            <StatCard label="Outstanding" value={`Rs. ${formatNumber(stats.outstanding)}`} icon={Wallet} color="text-amber-600" />
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by invoice, order, or customer..."
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
                  description="Try a different invoice number, order ID, or customer name."
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
