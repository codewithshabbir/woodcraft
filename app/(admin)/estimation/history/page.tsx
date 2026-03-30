"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calculator, FileClock, Wallet } from "lucide-react";

import PageHeader from "@/features/admin/components/shared/page-header";
import SearchInput from "@/features/admin/components/shared/search-input";
import StatCard from "@/features/admin/components/shared/stat-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { StatusMessage } from "@/components/shared/status-message";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EstimatesTable from "@/features/estimation/components/estimates-table";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { listEstimates } from "@/services/admin/admin.service";
import { formatNumber } from "@/lib/format";

export default function EstimationHistoryPage() {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const loadEstimates = useCallback(() => listEstimates(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadEstimates });

  const estimates = useMemo(() => data ?? [], [data]);

  const filteredEstimates = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return estimates;
    }

    return estimates.filter((estimate) =>
      `${estimate.id} ${estimate.customer} ${estimate.project}`.toLowerCase().includes(query),
    );
  }, [estimates, search]);

  const stats = useMemo(() => {
    const total = filteredEstimates.length;
    const approved = filteredEstimates.filter((estimate) => estimate.status === "Approved").length;
    const pending = filteredEstimates.filter((estimate) => estimate.status === "Pending").length;
    const averageValue = Math.round(
      filteredEstimates.reduce((sum, estimate) => sum + estimate.estimateAmount, 0) /
        Math.max(filteredEstimates.length, 1),
    );

    return { total, approved, pending, averageValue };
  }, [filteredEstimates]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Estimate History"
        description="Review previous quotations and compare project pricing decisions"
      />

      {message ? <StatusMessage type="success" message={message} /> : null}

      {isLoading ? <LoadingState title="Loading estimates..." /> : null}

      {!isLoading && error ? (
        <ErrorState
          title="Estimates could not be loaded"
          description="This screen already uses a service boundary, so retry is enough to restore the mock data."
          actionLabel="Retry"
          onAction={reload}
        />
      ) : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Estimates" value={stats.total} icon={FileClock} color="text-primary" />
            <StatCard label="Approved" value={stats.approved} icon={Calculator} color="text-emerald-600" />
            <StatCard label="Pending Review" value={stats.pending} icon={FileClock} color="text-amber-600" />
            <StatCard label="Average Value" value={`Rs. ${formatNumber(stats.averageValue)}`} icon={Wallet} color="text-sky-600" />
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by estimate ID, customer, or project..."
                className="w-full max-w-md"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quotation Records</CardTitle>
              <CardDescription>Historical estimates linked to customer projects and pricing outcomes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredEstimates.length === 0 ? (
                <EmptyState
                  title="No estimates match this search"
                  description="Try a different estimate ID, customer name, or project title."
                  className="min-h-45 rounded-none border-0"
                />
              ) : (
                <EstimatesTable estimates={filteredEstimates} />
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

