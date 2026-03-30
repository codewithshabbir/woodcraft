import Link from "next/link";
import { Building2, Pencil, Truck } from "lucide-react";

import InfoPair from "@/features/admin/components/shared/info-pair";
import PageHeader from "@/features/admin/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = {
    id,
    name: "ABC Traders",
    phone: "+92 300 1234567",
    email: "abc@traders.com",
    location: "Karachi",
    materials: ["Oak Wood", "Pine Wood", "Hardware Sets"],
    notes: "Reliable for urgent workshop restocks.",
  };

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
              <InfoPair label="Email" value={supplier.email} />
              <InfoPair label="Phone" value={supplier.phone} />
              <InfoPair label="Location" value={supplier.location} />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Materials Supplied</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {supplier.materials.map((item) => (
                <span key={item} className="rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                  {item}
                </span>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoPair label="Material Count" value={supplier.materials.length} />
              <InfoPair label="Status" value="Active Supplier" />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{supplier.notes}</CardContent>
          </Card>

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

