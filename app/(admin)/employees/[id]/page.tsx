import Link from "next/link";
import { Mail, Pencil, UserRound } from "lucide-react";

import InfoPair from "@/components/shared/info-pair";
import PageHeader from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getEmployee } from "@/lib/server/admin-data";
import { auth } from "@/lib/auth";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const employee = await getEmployee(id, { session });

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
              <InfoPair label="Employee ID" value={employee.id} />
              <InfoPair
                label="Email"
                value={
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {employee.email}
                  </span>
                }
              />
              <InfoPair label="Employee Type" value={employee.employeeType || "-"} />
              <InfoPair label="Hourly Rate" value={employee.hourlyRate} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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


