"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { createEstimate, updateEstimate } from "@/services/admin/admin.service"
import {
  defaultEstimationFormValues,
  estimationFormSchema,
  laborOptions,
  materialOptions,
  type EstimationFormValues,
  type LaborLine,
  type MaterialLine,
} from "@/features/estimation/schemas/estimation.schema"
import { ROUTES } from "@/lib/constants/routes"

type UseEstimationFormOptions = {
  mode?: "create" | "edit"
  estimateId?: string
  initialValues?: EstimationFormValues
}

export function useEstimationForm({ mode = "create", estimateId, initialValues }: UseEstimationFormOptions = {}) {
  const router = useRouter()
  const [values, setValues] = useState<EstimationFormValues>(initialValues ?? defaultEstimationFormValues)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const complexityMultiplier = useMemo(() => {
    switch (values.complexity) {
      case "low":
        return 0.9
      case "high":
        return 1.2
      default:
        return 1
    }
  }, [values.complexity])

  const materialRows = useMemo(() => {
    return values.materials.map((line) => {
      const selectedMaterial = materialOptions.find((material) => material.id === line.materialId)
      const lineCost = (selectedMaterial?.price ?? 0) * Number(line.quantity || 0)

      return {
        ...line,
        selectedMaterial,
        lineCost,
      }
    })
  }, [values.materials])

  const laborRows = useMemo(() => {
    return values.labor.map((line) => {
      const selectedRole = laborOptions.find((role) => role.id === line.roleId)
      const lineCost = (selectedRole?.ratePerHour ?? 0) * Number(line.hours || 0)

      return {
        ...line,
        selectedRole,
        lineCost,
      }
    })
  }, [values.labor])

  const materialSubtotal = materialRows.reduce((sum, row) => sum + row.lineCost, 0)
  const laborSubtotal = laborRows.reduce((sum, row) => sum + row.lineCost, 0)
  const adjustedBase = (materialSubtotal + laborSubtotal) * complexityMultiplier
  const overheadAmount = adjustedBase * (Number(values.overheadPercent || 0) / 100)
  const profitAmount = (adjustedBase + overheadAmount) * (Number(values.profitPercent || 0) / 100)
  const unitEstimate = adjustedBase + overheadAmount + profitAmount
  const totalEstimate = unitEstimate * Number(values.quantity || 0)

  const setField = <K extends keyof EstimationFormValues>(key: K, nextValue: EstimationFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: nextValue }))
  }

  const updateMaterial = (id: number, key: keyof Omit<MaterialLine, "id">, nextValue: string | number) => {
    setValues((current) => ({
      ...current,
      materials: current.materials.map((line) => (line.id === id ? { ...line, [key]: nextValue } : line)),
    }))
  }

  const updateLabor = (id: number, key: keyof Omit<LaborLine, "id">, nextValue: string | number) => {
    setValues((current) => ({
      ...current,
      labor: current.labor.map((line) => (line.id === id ? { ...line, [key]: nextValue } : line)),
    }))
  }

  const addMaterialLine = () => {
    setValues((current) => ({
      ...current,
      materials: [
        ...current.materials,
        { id: Date.now(), materialId: materialOptions[0].id, quantity: 1 },
      ],
    }))
  }

  const addLaborLine = () => {
    setValues((current) => ({
      ...current,
      labor: [
        ...current.labor,
        { id: Date.now(), roleId: laborOptions[0].id, hours: 1 },
      ],
    }))
  }

  const removeMaterialLine = (id: number) => {
    setValues((current) => ({
      ...current,
      materials: current.materials.filter((line) => line.id !== id),
    }))
  }

  const removeLaborLine = (id: number) => {
    setValues((current) => ({
      ...current,
      labor: current.labor.filter((line) => line.id !== id),
    }))
  }

  const saveDraft = async () => {
    const result = estimationFormSchema.safeParse(values)

    if (!result.success) {
      setSubmitError(result.error.issues[0]?.message ?? "Estimation data is invalid.")
      setSubmitSuccess(null)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const payload = {
        customer: result.data.customerName,
        project: result.data.projectTitle,
        estimateAmount: Math.round(totalEstimate),
        complexity: result.data.complexity,
        status: "Pending" as const,
        createdAt: new Date().toISOString().slice(0, 10),
        materials: materialSubtotal,
        labor: laborSubtotal,
        overheadPercent: result.data.overheadPercent,
        profitPercent: result.data.profitPercent,
        notes: result.data.notes,
      }

      const response = mode === "edit"
        ? await updateEstimate(estimateId ?? "", payload)
        : await createEstimate(payload)

      setSubmitSuccess(response.message)
      router.push(`${ROUTES.estimation.history}?message=${encodeURIComponent(response.message)}`)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Estimate could not be saved.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    submitError,
    submitSuccess,
    isSubmitting,
    materialRows,
    laborRows,
    materialSubtotal,
    laborSubtotal,
    complexityMultiplier,
    overheadAmount,
    profitAmount,
    unitEstimate,
    totalEstimate,
    setField,
    updateMaterial,
    updateLabor,
    addMaterialLine,
    addLaborLine,
    removeMaterialLine,
    removeLaborLine,
    saveDraft,
  }
}
