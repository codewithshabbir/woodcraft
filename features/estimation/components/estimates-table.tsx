"use client"

import Link from "next/link"
import { Eye, Pencil } from "lucide-react"

import StatusBadge from "@/features/admin/components/shared/status-badge"
import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { ROUTES } from "@/lib/constants/routes"
import type { EstimateRecord } from "@/types/admin"
import { formatNumber } from "@/lib/format";

type EstimatesTableProps = {
  estimates: EstimateRecord[]
}

export default function EstimatesTable({ estimates }: EstimatesTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-left text-muted-foreground">
            <th className="p-4 text-[11px] font-bold uppercase">Estimate</th>
            <th className="p-4 text-[11px] font-bold uppercase">Customer</th>
            <th className="p-4 text-[11px] font-bold uppercase">Project</th>
            <th className="p-4 text-[11px] font-bold uppercase">Amount</th>
            <th className="p-4 text-[11px] font-bold uppercase">Complexity</th>
            <th className="p-4 text-[11px] font-bold uppercase">Date</th>
            <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
            <th className="p-4 text-[11px] font-bold uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {estimates.map((estimate) => (
            <tr key={estimate.id} className="border-b border-border last:border-none transition hover:bg-muted/40">
              <td className="p-4 font-mono text-xs text-muted-foreground">{estimate.id}</td>
              <td className="p-4 font-semibold text-primary">{estimate.customer}</td>
              <td className="p-4">{estimate.project}</td>
              <td className="p-4 font-semibold">Rs. {formatNumber(estimate.estimateAmount)}</td>
              <td className="p-4">{estimate.complexity}</td>
              <td className="p-4">{estimate.createdAt}</td>
              <td className="p-4 text-center">
                <StatusBadge
                  label={estimate.status}
                  toneClassName={
                    estimate.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : estimate.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }
                />
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={ROUTES.estimation.detail(estimate.id)}>
                    <PrimaryButton size="sm" className="h-8 w-8 p-2">
                      <Eye className="h-4 w-4" />
                    </PrimaryButton>
                  </Link>
                  <Link href={ROUTES.estimation.edit(estimate.id)}>
                    <PrimaryButton size="sm" variant="secondary" className="h-8 w-8 p-2">
                      <Pencil className="h-4 w-4" />
                    </PrimaryButton>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
