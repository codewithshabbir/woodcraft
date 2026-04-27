import Link from "next/link";
import { Building2, Pencil } from "lucide-react";

import InfoPair from "@/components/shared/info-pair";
import PageHeader from "@/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getSupplier } from "@/lib/server/admin-data";
import { auth } from "@/lib/auth";

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const supplier = await getSupplier(id, { session });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Supplier Details"
        description={`${supplier.id} - ${supplier.name}`}
        backHref={ROUTES.suppliers.root}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Supplier Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <InfoPair label="Name" value={supplier.name} />
              <InfoPair label="Email" value={supplier.email || "-"} />
              <InfoPair label="Phone" value={supplier.phone} />
              <InfoPair label="Location" value={supplier.location} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Link href={ROUTES.suppliers.edit(supplier.id)}>
            <PrimaryButton className="w-full p-5">
              <Pencil className="h-4 w-4" />
              Edit Supplier
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
