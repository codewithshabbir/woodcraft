"use client"

import Link from "next/link"
import { Eye } from "lucide-react"

import StatusBadge from "@/features/admin/components/shared/status-badge"
import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { ROUTES } from "@/lib/constants/routes"
import type { InvoiceRecord } from "@/types/admin"
import { formatNumber } from "@/lib/format";

type InvoicesTableProps = {
  invoices: InvoiceRecord[]
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-left text-muted-foreground">
            <th className="p-4 text-[11px] font-bold uppercase">Invoice</th>
            <th className="p-4 text-[11px] font-bold uppercase">Order</th>
            <th className="p-4 text-[11px] font-bold uppercase">Customer</th>
            <th className="p-4 text-[11px] font-bold uppercase">Amount</th>
            <th className="p-4 text-[11px] font-bold uppercase">Paid</th>
            <th className="p-4 text-[11px] font-bold uppercase">Due</th>
            <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
            <th className="p-4 text-[11px] font-bold uppercase text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-border last:border-none transition hover:bg-muted/40">
              <td className="p-4 font-mono text-xs text-muted-foreground">{invoice.id}</td>
              <td className="p-4 font-mono text-xs text-muted-foreground">{invoice.orderId}</td>
              <td className="p-4 font-semibold text-primary">{invoice.customer}</td>
              <td className="p-4 font-medium">Rs. {formatNumber(invoice.amount)}</td>
              <td className="p-4">Rs. {formatNumber(invoice.paid)}</td>
              <td className="p-4 font-semibold text-amber-700">Rs. {formatNumber((invoice.amount - invoice.paid))}</td>
              <td className="p-4 text-center">
                <StatusBadge
                  label={invoice.status}
                  toneClassName={
                    invoice.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : invoice.status === "Partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }
                />
              </td>
              <td className="p-4 text-right">
                <Link href={ROUTES.billing.invoices.detail(invoice.id)}>
                  <PrimaryButton size="sm" className="h-8 w-8 p-2">
                    <Eye className="h-4 w-4" />
                  </PrimaryButton>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
