"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { DollarSign, Plus, Users, Wrench } from "lucide-react";

import PageHeader from "@/components/shared/page-header";
import SearchInput from "@/components/shared/search-input";
import StatCard from "@/components/shared/stat-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeesTable from "@/features/employees/employees-table";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ROUTES } from "@/lib/constants/routes";
import { listEmployees } from "@/services/admin/admin.service";
import { Suspense } from "react";

function EmployeesPageContent() {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const loadEmployees = useCallback(() => listEmployees(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadEmployees });

  const employees = useMemo(() => data ?? [], [data]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter((employee) =>
      `${employee.name} ${employee.employeeType} ${employee.email} ${employee.id}`.toLowerCase().includes(query),
    );
  }, [employees, search]);

  const stats = useMemo(() => {
    const totalEmployees = filteredEmployees.length;
    const avgHourlyRate = totalEmployees
      ? Math.round(filteredEmployees.reduce((sum, employee) => sum + Number(employee.hourlyRate || 0), 0) / totalEmployees)
      : 0;
    const distinctTypes = new Set(filteredEmployees.map((e) => String(e.employeeType || "").trim()).filter(Boolean)).size;
    return { totalEmployees, avgHourlyRate, distinctTypes };
  }, [filteredEmployees]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employees"
        description="Register employees and manage skill types and hourly wages"
        action={
          <Link href={ROUTES.employees.new}>
            <PrimaryButton className="p-5">
              <Plus className="h-4 w-4" />
              Add Employee
            </PrimaryButton>
          </Link>
        }
      />
      {message ? <StatusMessage type="success" message={message} /> : null}
      {isLoading ? <LoadingState title="Loading employees..." /> : null}
      {!isLoading && error ? <ErrorState title="Employees could not be loaded" description={error} actionLabel="Retry" onAction={reload} /> : null}
      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total Employees" value={stats.totalEmployees} icon={Users} color="text-primary" />
            <StatCard label="Skill Types" value={stats.distinctTypes} icon={Wrench} color="text-sky-600" />
            <StatCard label="Avg Hourly Rate" value={stats.avgHourlyRate} icon={DollarSign} color="text-emerald-600" />
          </div>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by name, type, email, or ID..."
                className="w-full max-w-md"
              />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Team Directory</CardTitle>
              <CardDescription>Employees are used for assignment, wages, and productivity reporting.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredEmployees.length === 0 ? (
                <EmptyState
                  title="No employees match this search"
                  description="Try a different name, type, email, or ID."
                  className="min-h-[180px] rounded-none border-0"
                />
              ) : (
                <EmployeesTable employees={filteredEmployees} onDeleteComplete={reload} />
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}


export default function EmployeesPage() {
  return (
    <Suspense fallback={null}>
      <EmployeesPageContent />
    </Suspense>
  )
}
