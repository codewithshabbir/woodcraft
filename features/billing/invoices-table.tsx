"use client"

import Link from "next/link"
import { Eye } from "lucide-react"

import StatusBadge from "@/components/shared/status-badge"
import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { ROUTES } from "@/lib/constants/routes"
import type { InvoiceRecord } from "@/types/entities/admin"
import { formatNumber } from "@/lib/format";

type InvoicesTableProps = {
  invoices: InvoiceRecord[]
}

function getInvoiceTone(status: string) {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "paid") return "bg-green-100 text-green-700";
  if (normalized === "partial") return "bg-yellow-100 text-yellow-700";
  if (normalized === "unpaid") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-225 text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-left text-muted-foreground">
            <th className="p-4 text-[11px] font-bold uppercase">Invoice</th>
            <th className="p-4 text-[11px] font-bold uppercase">Order</th>
            <th className="p-4 text-[11px] font-bold uppercase">Total</th>
            <th className="p-4 text-[11px] font-bold uppercase">Generated</th>
            <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
            <th className="p-4 text-[11px] font-bold uppercase text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-border last:border-none transition hover:bg-muted/40">
              <td className="p-4 font-mono text-xs text-muted-foreground">{invoice.id}</td>
              <td className="p-4 font-mono text-xs text-muted-foreground">{invoice.orderId}</td>
              <td className="p-4 font-medium">Rs. {formatNumber(invoice.totalAmount)}</td>
              <td className="p-4 text-muted-foreground">{new Date(invoice.generatedDate).toLocaleDateString()}</td>
              <td className="p-4 text-center">
                <StatusBadge
                  label={invoice.status}
                  toneClassName={getInvoiceTone(invoice.status)}
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
