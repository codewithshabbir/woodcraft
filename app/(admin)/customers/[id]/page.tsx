import Link from "next/link";
import { Pencil, UserRound } from "lucide-react";

import InfoPair from "@/components/shared/info-pair";
import PageHeader from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getCustomer } from "@/lib/server/admin-data";
import { auth } from "@/lib/auth";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const customer = await getCustomer(id, { session });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader title="Customer Details" description={`${customer.id} - ${customer.name}`} backHref={ROUTES.customers.root} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                Customer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <InfoPair label="Name" value={customer.name} />
              <InfoPair label="Phone" value={customer.phone} />
              <InfoPair label="Email" value={customer.email || "-"} />
              <InfoPair label="Address" value={customer.address || "-"} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Link href={ROUTES.customers.edit(customer.id)}>
            <PrimaryButton className="w-full p-5">
              <Pencil className="h-4 w-4" />
              Edit Customer
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
