import Link from "next/link";
import { ArrowLeft, Calendar, Package, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ROUTES } from "@/lib/constants/routes";
import { getPurchaseRecord } from "@/services/admin/admin.service";
import { formatNumber } from "@/lib/format";

export default async function PurchaseRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getPurchaseRecord(id);
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-primary">Purchase Record Details</h1><p className="mt-1 text-sm text-muted-foreground"><span className="font-mono font-bold text-foreground">{record.id}</span> - {record.material}</p></div><Link href={ROUTES.suppliers.purchaseRecords.root}><PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton></Link></div>
      <div className="grid gap-6 lg:grid-cols-3"><div className="space-y-6 lg:col-span-2"><Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Purchase Summary</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-6"><Info label="Material" value={record.material} /><Info label="Supplier" value={record.supplier} /><Info label="Quantity" value={`${record.quantity} ${record.unit}`} /><Info label="Price" value={`Rs. ${record.price}`} /></CardContent></Card><Card className="shadow-sm"><CardHeader><CardTitle>Notes</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">{record.notes}</CardContent></Card></div><div className="space-y-6"><Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" />Billing</CardTitle></CardHeader><CardContent className="space-y-4"><Info label="Total" value={`Rs. ${formatNumber(record.total)}`} /><Info label="Invoice" value={record.invoice} /></CardContent></Card><Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Date</CardTitle></CardHeader><CardContent><Info label="Purchase Date" value={record.date} /></CardContent></Card></div></div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) { return <div className="space-y-1"><p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p><div className="font-medium text-foreground">{value}</div></div>; }


