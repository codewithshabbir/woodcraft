"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ROUTES } from "@/lib/constants/routes";

export default function NewPurchaseRecordPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-primary">Add Purchase Record</h1><p className="mt-1 text-sm text-muted-foreground">Log a new supplier transaction for inventory restocking</p></div><Link href={ROUTES.suppliers.purchaseRecords.root}><PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary"><ArrowLeft className="h-4 w-4" />Back</PrimaryButton></Link></div>
      <form className="space-y-6">
        <Card className="shadow-sm"><CardHeader><CardTitle>Purchase Details</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-2"><Field label="Record ID"><Input className="h-10" placeholder="PR-003" /></Field><Field label="Supplier"><select className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"><option>ABC Traders</option><option>Wood Masters</option></select></Field><Field label="Material"><Input className="h-10" placeholder="Oak Wood" /></Field><Field label="Unit"><Input className="h-10" placeholder="ft" /></Field><Field label="Quantity"><Input type="number" className="h-10" placeholder="50" /></Field><Field label="Price Per Unit"><Input type="number" className="h-10" placeholder="500" /></Field><Field label="Purchase Date"><Input type="date" className="h-10" /></Field><Field label="Invoice / Bill No."><Input className="h-10" placeholder="INV-245" /></Field></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle>Notes</CardTitle></CardHeader><CardContent><textarea className="min-h-[120px] w-full rounded-md border border-border p-3 text-sm outline-none" placeholder="Delivery condition, supplier note, or stock remarks..." /></CardContent></Card>
        <div className="flex justify-end gap-3"><Link href={ROUTES.suppliers.purchaseRecords.root}><PrimaryButton variant="outline" className="border-primary hover:border-primary">Cancel</PrimaryButton></Link><PrimaryButton className="p-5"><Save className="h-4 w-4" />Create Record</PrimaryButton></div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>{children}</div>; }

