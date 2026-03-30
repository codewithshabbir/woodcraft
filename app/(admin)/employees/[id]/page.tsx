import Link from "next/link";
import { Briefcase, Pencil, UserRound } from "lucide-react";

import InfoPair from "@/features/admin/components/shared/info-pair";
import PageHeader from "@/features/admin/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ROUTES } from "@/lib/constants/routes";
import { getEmployee } from "@/services/admin/admin.service";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await getEmployee(id);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Employee Details"
        description={`${employee.id} - ${employee.name}`}
        backHref={ROUTES.employees.root}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <InfoPair label="Role" value={employee.role} />
              <InfoPair label="Phone" value={employee.phone} />
              <InfoPair label="Weekly Hours" value={`${employee.weeklyHours} hrs`} />
              <InfoPair label="Active Jobs" value={employee.activeJobs} />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{employee.notes}</CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoPair label="Efficiency" value={`${employee.efficiency}%`} />
              <Progress value={employee.efficiency} className="h-2" />
            </CardContent>
          </Card>

          <Link href={ROUTES.employees.edit(employee.id)}>
            <PrimaryButton className="w-full p-5">
              <Pencil className="h-4 w-4" />
              Edit Employee
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}


