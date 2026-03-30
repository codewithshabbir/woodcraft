"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Briefcase, Plus, Star, TimerReset, Users } from "lucide-react";

import PageHeader from "@/features/admin/components/shared/page-header";
import SearchInput from "@/features/admin/components/shared/search-input";
import StatCard from "@/features/admin/components/shared/stat-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeesTable from "@/features/employees/components/employees-table";
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
    return employees.filter((employee) => `${employee.name} ${employee.role} ${employee.id}`.toLowerCase().includes(query));
  }, [employees, search]);

  const stats = useMemo(() => {
    const totalEmployees = filteredEmployees.length;
    const activeEmployees = filteredEmployees.filter((employee) => employee.status === "Active").length;
    const totalActiveJobs = filteredEmployees.reduce((sum, employee) => sum + employee.activeJobs, 0);
    const avgEfficiency = Math.round(filteredEmployees.reduce((sum, employee) => sum + employee.efficiency, 0) / Math.max(filteredEmployees.length, 1));
    return { totalEmployees, activeEmployees, totalActiveJobs, avgEfficiency };
  }, [filteredEmployees]);

  return (
    <div className="space-y-8">
      <PageHeader title="Employees" description="Manage craftsmen, capacity, availability, and performance" action={<Link href={ROUTES.employees.new}><PrimaryButton className="p-5"><Plus className="h-4 w-4" />Add Employee</PrimaryButton></Link>} />
      {message ? <StatusMessage type="success" message={message} /> : null}
      {isLoading ? <LoadingState title="Loading employees..." /> : null}
      {!isLoading && error ? <ErrorState title="Employees could not be loaded" description="The workforce directory is using a mock service layer right now. Retry to restore the screen state." actionLabel="Retry" onAction={reload} /> : null}
      {!isLoading && !error ? <><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total Employees" value={stats.totalEmployees} icon={Users} color="text-primary" /><StatCard label="Active Employees" value={stats.activeEmployees} icon={Star} color="text-emerald-600" /><StatCard label="Assigned Jobs" value={stats.totalActiveJobs} icon={Briefcase} color="text-sky-600" /><StatCard label="Avg Efficiency" value={`${stats.avgEfficiency}%`} icon={TimerReset} color="text-amber-600" /></div><Card className="shadow-sm"><CardContent className="p-4"><SearchInput value={search} onChange={setSearch} placeholder="Search by employee name, role, or ID..." className="w-full max-w-md" /></CardContent></Card><Card className="shadow-sm"><CardHeader><CardTitle>Team Directory</CardTitle><CardDescription>Workforce overview with live utilization and current availability</CardDescription></CardHeader><CardContent className="p-0">{filteredEmployees.length === 0 ? <EmptyState title="No employees match this search" description="Try a different employee name, role, or ID to see results here." className="min-h-[180px] rounded-none border-0" /> : <EmployeesTable employees={filteredEmployees} onDeleteComplete={reload} />}</CardContent></Card></> : null}
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