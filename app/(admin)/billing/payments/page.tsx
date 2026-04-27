"use client";

import { useCallback, useMemo, useState } from "react";
import { BadgeCheck, CreditCard, HandCoins, Search, WalletMinimal } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { cn } from "@/lib/helpers";
import { formatNumber } from "@/lib/format";
import { listPayments } from "@/services/admin/admin.service";

export default function BillingPaymentsPage() {
  const [search, setSearch] = useState("");
  const loadPayments = useCallback(() => listPayments(), []);
  const { data, error, isLoading, reload } = useAsyncResource({ loader: loadPayments });

  const payments = useMemo(() => data ?? [], [data]);
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) =>
      `${payment.id} ${payment.invoiceId}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [payments, search]);

  const stats = useMemo(() => {
    const totalPayments = filteredPayments.length;
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

    return { totalPayments, totalAmount };
  }, [filteredPayments]);

  const recoveryNotes = useMemo(() => {
    const largestPayment = filteredPayments.slice().sort((a, b) => b.amount - a.amount)[0];

    return [
      { title: "Largest Payment", value: largestPayment ? `Rs. ${formatNumber(largestPayment.amount)}` : "Rs. 0", icon: HandCoins },
      { title: "Largest Recovery", value: largestPayment ? `Rs. ${formatNumber(largestPayment.amount)}` : "Rs. 0", icon: CreditCard },
      { title: "Total Entries", value: `${filteredPayments.length} payment(s)`, icon: WalletMinimal },
    ];
  }, [filteredPayments]);

  if (isLoading) return <LoadingState title="Loading payments..." />;
  if (error) return <ErrorState title="Payments could not be loaded" description={error} actionLabel="Retry" onAction={reload} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record payments and monitor invoice recoveries
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Payment Entries", val: stats.totalPayments, icon: CreditCard, color: "text-primary" },
          { label: "Total Amount", val: `Rs. ${formatNumber(stats.totalAmount)}`, icon: BadgeCheck, color: "text-emerald-600" },
          { label: "Last Updated", val: "-", icon: WalletMinimal, color: "text-amber-600" },
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
          <div className="flex w-full max-w-md items-center">
            <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-muted px-3 focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by payment ID or invoice..."
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
                    <th className="p-4 text-[11px] font-bold uppercase">Amount</th>
                    <th className="p-4 text-[11px] font-bold uppercase">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border last:border-none hover:bg-muted/40 transition">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{payment.id}</td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{payment.invoiceId}</td>
                      <td className="p-4 font-semibold">Rs. {formatNumber(payment.amount)}</td>
                      <td className="p-4">{payment.paymentDate}</td>
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
            {recoveryNotes.map((item) => (
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
