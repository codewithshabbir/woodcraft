"use client"

import Link from "next/link"
import { Eye, Pencil, Trash2 } from "lucide-react"

import ConfirmDeleteDialog from "@/components/shared/confirm-delete-dialog"
import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { ROUTES } from "@/lib/constants/routes"
import type { EmployeeRecord } from "@/types/entities/admin"

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
            <th className="p-4 text-[11px] font-bold uppercase">Email</th>
            <th className="p-4 text-[11px] font-bold uppercase">Employee Type</th>
            <th className="p-4 text-[11px] font-bold uppercase">Hourly Rate</th>
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
              <td className="p-4">{employee.email}</td>
              <td className="p-4">{employee.employeeType || "-"}</td>
              <td className="p-4">{employee.hourlyRate}</td>
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
