"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { useEffect, useMemo, useState } from "react"

import { createOrder, listRawMaterials, updateOrder } from "@/services/admin/admin.service"
import {
  getDefaultOrderFormValues,
  orderFormSchema,
} from "@/features/orders/order-form.schema"
import type { OrderFormValues } from "@/types/ui/forms/order"
import { ROUTES } from "@/lib/constants/routes"

type UseOrderFormOptions = {
  mode: "create" | "edit"
  orderId?: string
  initialData?: Partial<OrderFormValues>
}

export function useOrderForm({ mode, orderId, initialData }: UseOrderFormOptions) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [materials, setMaterials] = useState<Array<{ id: string; name: string; pricePerUnit: number }>>([])

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: getDefaultOrderFormValues(initialData),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materialsUsed",
  })

  const materialsUsed = useWatch({
    control: form.control,
    name: "materialsUsed",
  })

  const estimatedMaterialCost = useMemo(() => {
    const usage = Array.isArray(materialsUsed) ? materialsUsed : []
    return usage.reduce((sum, item) => {
      const materialId = String(item?.materialId || "")
      if (!materialId) return sum
      const quantityUsed = Number(item?.quantityUsed || 0)
      if (!Number.isFinite(quantityUsed) || quantityUsed <= 0) return sum
      const pricePerUnit = Number(materials.find((mat) => mat.id === materialId)?.pricePerUnit || 0)
      return sum + quantityUsed * pricePerUnit
    }, 0)
  }, [materials, materialsUsed])

  useEffect(() => {
    let cancelled = false

    void listRawMaterials()
      .then((rows) => {
        if (cancelled) return
        setMaterials(rows.map((row) => ({
          id: row.id,
          name: row.name,
          pricePerUnit: row.pricePerUnit,
        })))
      })
      .catch(() => {
        if (!cancelled) {
          setMaterials([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const addMaterial = () => append({ materialId: "", quantityUsed: 1 })
  const removeMaterial = (index: number) => remove(index)

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const payload =
        mode === "create"
          ? {
              customerId: values.customerId,
              description: values.description,
              startDate: values.startDate || undefined,
              endDate: values.endDate || undefined,
              materialsUsed: (values.materialsUsed || []).map((item) => ({
                materialId: item.materialId,
                quantityUsed: Number(item.quantityUsed || 0),
              })),
            }
          : {
              description: values.description,
              status: values.status,
              startDate: values.startDate || undefined,
              endDate: values.endDate || undefined,
            }

      const result = mode === "create"
        ? await createOrder(payload)
        : await updateOrder(orderId ?? "", payload)

      setSubmitSuccess(result.message)
      router.push(`${ROUTES.orders.root}?message=${encodeURIComponent(result.message)}`)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Order could not be saved.")
    } finally {
      setIsSubmitting(false)
    }
  })

  return {
    form,
    fields,
    materials,
    materialsUsed,
    estimatedMaterialCost,
    addMaterial,
    removeMaterial,
    onSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
  }
}
