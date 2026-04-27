import { FileSpreadsheet, Wallet } from "lucide-react";
import { notFound } from "next/navigation";

import InfoPair from "@/components/shared/info-pair";
import PageHeader from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getInvoice } from "@/lib/server/admin-data";
import { formatNumber } from "@/lib/format";
import { auth } from "@/lib/auth";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const invoice = await getInvoice(id, { session });
  if (!invoice) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Invoice Details"
        description={invoice.id}
        backHref={ROUTES.billing.invoices.root}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <InfoPair label="Order ID" value={invoice.orderId} />
              <InfoPair label="Status" value={invoice.status} />
              <InfoPair label="Total Amount" value={`Rs. ${formatNumber(invoice.totalAmount)}`} />
              <InfoPair label="Generated Date" value={new Date(invoice.generatedDate).toLocaleDateString()} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoPair label="Total Paid" value={`Rs. ${formatNumber(invoice.totalPaid || 0)}`} />
              <InfoPair label="Remaining" value={`Rs. ${formatNumber(invoice.remainingBalance || 0)}`} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
