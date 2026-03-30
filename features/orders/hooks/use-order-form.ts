"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { useState } from "react"

import { createOrder, updateOrder } from "@/services/admin/admin.service"
import {
  createEmptyOrderItem,
  getDefaultOrderFormValues,
  orderFormSchema,
  type OrderFormValues,
} from "@/features/orders/schemas/order-form.schema"
import { ROUTES } from "@/lib/constants/routes"

const calculateOrderTotal = (items: OrderFormValues["items"]) =>
  items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0)

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

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: getDefaultOrderFormValues(initialData),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const items = useWatch({
    control: form.control,
    name: "items",
  })

  const totalAmount = calculateOrderTotal(items ?? [])

  const addItem = () => append(createEmptyOrderItem())
  const removeItem = (index: number) => remove(index)

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const payload = {
        customerName: values.customerName,
        deadline: values.deadline,
        status: values.status,
        paymentStatus: values.paymentStatus,
        items: values.items,
        itemsCount: values.items.length,
        totalAmount,
        paidAmount:
          values.paymentStatus === "paid"
            ? totalAmount
            : values.paymentStatus === "partial"
              ? Math.round(totalAmount * 0.5)
              : 0,
        notes: values.notes,
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
    totalAmount,
    addItem,
    removeItem,
    onSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
  }
}
