"use client"

import Link from "next/link"
import { Eye, Pencil, Trash2 } from "lucide-react"

import ConfirmDeleteDialog from "@/features/admin/components/shared/confirm-delete-dialog"
import StatusBadge from "@/features/admin/components/shared/status-badge"
import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { Progress } from "@/components/ui/progress"
import { ROUTES } from "@/lib/constants/routes"
import type { EmployeeRecord } from "@/types/admin"

type EmployeesTableProps = {
  employees: EmployeeRecord[]
  onDeleteComplete?: () => void | Promise<void>
}

export default function EmployeesTable({ employees, onDeleteComplete }: EmployeesTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[940px] text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-left text-muted-foreground">
            <th className="p-4 text-[11px] font-bold uppercase">Employee</th>
            <th className="p-4 text-[11px] font-bold uppercase">Role</th>
            <th className="p-4 text-[11px] font-bold uppercase">Phone</th>
            <th className="p-4 text-[11px] font-bold uppercase">Jobs</th>
            <th className="p-4 text-[11px] font-bold uppercase">Hours</th>
            <th className="p-4 text-[11px] font-bold uppercase">Efficiency</th>
            <th className="p-4 text-[11px] font-bold uppercase text-center">Status</th>
            <th className="p-4 text-[11px] font-bold uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-border last:border-none transition hover:bg-muted/40">
              <td className="p-4">
                <div>
                  <p className="font-semibold text-primary">{employee.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{employee.id}</p>
                </div>
              </td>
              <td className="p-4">{employee.role}</td>
              <td className="p-4">{employee.phone}</td>
              <td className="p-4">{employee.activeJobs}</td>
              <td className="p-4">{employee.weeklyHours} hrs</td>
              <td className="w-[220px] p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-bold text-primary">{employee.efficiency}%</span>
                  </div>
                  <Progress value={employee.efficiency} className="h-2" />
                </div>
              </td>
              <td className="p-4 text-center">
                <StatusBadge
                  label={employee.status}
                  toneClassName={employee.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}
                />
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={ROUTES.employees.detail(employee.id)}>
                    <PrimaryButton size="sm" className="h-8 w-8 p-2">
                      <Eye className="h-4 w-4" />
                    </PrimaryButton>
                  </Link>
                  <Link href={ROUTES.employees.edit(employee.id)}>
                    <PrimaryButton size="sm" variant="secondary" className="h-8 w-8 p-2">
                      <Pencil className="h-4 w-4" />
                    </PrimaryButton>
                  </Link>
                  <ConfirmDeleteDialog
                    itemId={employee.id}
                    entityType="employee"
                    entityLabel="employee"
                    onDeleted={onDeleteComplete}
                    trigger={
                      <PrimaryButton size="sm" variant="destructive" className="h-8 w-8 p-2">
                        <Trash2 className="h-4 w-4" />
                      </PrimaryButton>
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
