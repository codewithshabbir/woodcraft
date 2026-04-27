"use client";

import { useCallback } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import PageHeader from "@/components/shared/page-header";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { getDashboardAnalytics } from "@/services/dashboard/dashboard.service";

export default function DashboardAnalyticsPage() {
  const loadAnalytics = useCallback(() => getDashboardAnalytics("6-months"), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadAnalytics });

  if (isLoading) return <LoadingState title="Loading dashboard analytics..." />;
  if (error || !data) {
    return (
      <ErrorState
        title="Analytics could not be loaded"
        description={error || "No analytics data returned."}
        actionLabel="Retry"
        onAction={reload}
      />
    );
  }

  const chartMax = Math.max(1, ...data.monthlyFinance.map((m) => Math.max(m.income, m.expenses)));

  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" description="Income vs expenses trend." />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Based on payments received and recorded expenses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(data.monthlyFinance.length, 6))}, minmax(0, 1fr))` }}
          >
            {data.monthlyFinance.map((month) => (
              <div key={month.month} className="flex flex-col items-center gap-3">
                <div className="flex h-64 items-end gap-2">
                  <div className="w-5 rounded-t-md bg-primary/85" style={{ height: `${(month.income / chartMax) * 100}%` }} />
                  <div className="w-5 rounded-t-md bg-amber-400/90" style={{ height: `${(month.expenses / chartMax) * 100}%` }} />
                </div>
                <div className="text-center text-sm">
                  <p className="font-semibold text-foreground">{month.month}</p>
                  <p className="text-xs text-muted-foreground">
                    Income {month.income} / Expenses {month.expenses}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

