"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/shared/page-header";
import SearchInput from "@/components/shared/search-input";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import ConfirmDeleteDialog from "@/components/shared/confirm-delete-dialog";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { listExpenses } from "@/services/admin/admin.service";

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const loadExpenses = useCallback(() => listExpenses(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadExpenses });

  const expenses = useMemo(() => data ?? [], [data]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter((e) => `${e.type} ${e.notes || ""} ${e.id}`.toLowerCase().includes(q));
  }, [expenses, search]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Expenses"
        description="Record and review expenses for reporting (revenue vs expenses)."
        action={
          <Link href={ROUTES.expenses.new}>
            <PrimaryButton className="p-5">
              <Plus className="h-4 w-4" />
              Add Expense
            </PrimaryButton>
          </Link>
        }
      />

      {isLoading ? <LoadingState title="Loading expenses..." /> : null}
      {!isLoading && error ? (
        <ErrorState title="Expenses could not be loaded" description={error} actionLabel="Retry" onAction={reload} />
      ) : null}

      {!isLoading && !error ? (
        <>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput value={search} onChange={setSearch} placeholder="Search by type, note, or ID..." className="w-full max-w-md" />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>These entries are used in reports and dashboards.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <EmptyState title="No expenses found" description="Add an expense entry to begin tracking." className="min-h-[200px] rounded-none border-0" />
              ) : (
                <div className="w-full overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                        <th className="p-4 text-[11px] font-bold uppercase">Expense</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Amount</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Date</th>
                        <th className="p-4 text-[11px] font-bold uppercase">Notes</th>
                        <th className="p-4 text-right text-[11px] font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row) => (
                        <tr key={row.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                          <td className="p-4">
                            <p className="font-semibold text-primary">{row.type}</p>
                            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{row.id}</p>
                          </td>
                          <td className="p-4">{row.amount}</td>
                          <td className="p-4">{new Date(row.date).toISOString().slice(0, 10)}</td>
                          <td className="p-4 text-muted-foreground">{row.notes || "-"}</td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <ConfirmDeleteDialog
                              itemId={row.id}
                              entityType="expense"
                              entityLabel="expense"
                              onDeleted={reload}
                              trigger={
                                <PrimaryButton size="sm" variant="destructive" className="h-8 w-8 p-2">
                                  <Trash2 className="h-4 w-4" />
                                </PrimaryButton>
                              }
                            />
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

