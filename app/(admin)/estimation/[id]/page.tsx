import Link from "next/link";
import { Calculator, Pencil, Wallet } from "lucide-react";

import InfoPair from "@/features/admin/components/shared/info-pair";
import PageHeader from "@/features/admin/components/shared/page-header";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getEstimate } from "@/services/admin/admin.service";
import { formatNumber } from "@/lib/format";

export default async function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const estimateData = await getEstimate(id);
  const estimate = {
    ...estimateData,
    materials: estimateData.materials ?? 0,
    labor: estimateData.labor ?? 0,
    total: estimateData.estimateAmount,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader title="Estimate Details" description={`${estimate.id} - ${estimate.project}`} backHref={ROUTES.estimation.history} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" />Estimate Breakdown</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <InfoPair label="Customer" value={estimate.customer} />
              <InfoPair label="Project" value={estimate.project} />
              <InfoPair label="Materials" value={`Rs. ${formatNumber(estimate.materials)}`} />
              <InfoPair label="Labor" value={`Rs. ${formatNumber(estimate.labor)}`} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" />Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InfoPair label="Total" value={`Rs. ${formatNumber(estimate.total)}`} />
              <InfoPair label="Status" value={estimate.status} />
            </CardContent>
          </Card>

          <Link href={ROUTES.estimation.edit(estimate.id)}>
            <PrimaryButton className="w-full p-5"><Pencil className="h-4 w-4" />Edit Estimate</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}