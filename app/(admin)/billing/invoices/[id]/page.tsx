import { FileSpreadsheet, Wallet } from "lucide-react";

import InfoPair from "@/features/admin/components/shared/info-pair";
import PageHeader from "@/features/admin/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getInvoice } from "@/services/admin/admin.service";
import { formatNumber } from "@/lib/format";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Invoice Details"
        description={`${invoice.id} - ${invoice.customer}`}
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
              <InfoPair label="Customer" value={invoice.customer} />
              <InfoPair label="Invoice Amount" value={`Rs. ${formatNumber(invoice.amount)}`} />
              <InfoPair label="Paid" value={`Rs. ${formatNumber(invoice.paid)}`} />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{invoice.notes}</CardContent>
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
              <InfoPair label="Outstanding" value={`Rs. ${formatNumber((invoice.amount - invoice.paid))}`} />
              <InfoPair label="Due Date" value={invoice.dueDate} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
