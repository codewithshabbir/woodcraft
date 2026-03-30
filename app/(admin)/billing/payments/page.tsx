"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CreditCard,
  HandCoins,
  Search,
  WalletMinimal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

const payments = [
  { id: "PAY-001", invoiceId: "INV-001", customer: "Nova Studio", method: "Bank Transfer", amount: 50000, date: "2026-03-29", status: "Confirmed" },
  { id: "PAY-002", invoiceId: "INV-001", customer: "Nova Studio", method: "Cash", amount: 30000, date: "2026-03-30", status: "Confirmed" },
  { id: "PAY-003", invoiceId: "INV-003", customer: "Ayesha Interiors", method: "Cheque", amount: 60000, date: "2026-04-01", status: "Pending" },
];

export default function BillingPaymentsPage() {
  const [search, setSearch] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) =>
      `${payment.id} ${payment.invoiceId} ${payment.customer} ${payment.method}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  const stats = useMemo(() => {
    const totalPayments = filteredPayments.length;
    const confirmedAmount = filteredPayments
      .filter((payment) => payment.status === "Confirmed")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = filteredPayments
      .filter((payment) => payment.status === "Pending")
      .reduce((sum, payment) => sum + payment.amount, 0);

    return { totalPayments, confirmedAmount, pendingAmount };
  }, [filteredPayments]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record recoveries, review payment methods, and monitor pending receipts
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Payment Entries", val: stats.totalPayments, icon: CreditCard, color: "text-primary" },
          { label: "Confirmed Amount", val: `Rs. ${formatNumber(stats.confirmedAmount)}`, icon: BadgeCheck, color: "text-emerald-600" },
          { label: "Pending Clearance", val: `Rs. ${formatNumber(stats.pendingAmount)}`, icon: WalletMinimal, color: "text-amber-600" },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl border border-border shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <h2 className={cn("mt-1 text-2xl font-bold", item.color)}>{item.val}</h2>
              </div>
              <item.icon className={cn("h-8 w-8 opacity-20", item.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center w-full max-w-md">
            <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-muted px-3 focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by payment ID, invoice, customer, or method..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Payment Ledger</CardTitle>
            <CardDescription>Payment activity against customer invoices and due balances</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="p-4 text-[11px] font-bold uppercase">Payment</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Invoice</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Customer</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Method</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Amount</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Date</th>
                    <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{payment.id}</td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{payment.invoiceId}</td>
                      <td className="p-4 font-semibold text-primary">{payment.customer}</td>
                      <td className="p-4">{payment.method}</td>
                      <td className="p-4 font-semibold">Rs. {formatNumber(payment.amount)}</td>
                      <td className="p-4">{payment.date}</td>
                      <td className="p-4 text-center">
                        <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold uppercase", payment.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recovery Notes</CardTitle>
            <CardDescription>Payment handling guidance for admin review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Most Used Method", value: "Bank Transfer", icon: HandCoins },
              { title: "Largest Recovery", value: "Rs. 60,000", icon: CreditCard },
              { title: "Pending Review", value: "1 cheque clearance", icon: WalletMinimal },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary"><item.icon className="h-4 w-4" /></div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}