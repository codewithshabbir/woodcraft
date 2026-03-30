import * as z from "zod"

export const orderItemSchema = z.object({
  productTitle: z.string().min(1, "Product title is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  materialId: z.string().min(1, "Material reference is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
})

export const orderFormSchema = z.object({
  customerName: z.string().min(2, "Customer name required"),
  deadline: z.string(),
  status: z.enum(["pending", "in_progress", "completed"]),
  paymentStatus: z.enum(["unpaid", "partial", "paid"]),
  items: z.array(orderItemSchema).min(1, "At least one order item is required"),
  notes: z.string().optional(),
})

export type OrderFormValues = z.infer<typeof orderFormSchema>

export const createEmptyOrderItem = (): OrderFormValues["items"][number] => ({
  productTitle: "",
  dimensions: "",
  materialId: "",
  quantity: 1,
  unitPrice: 0,
})

export const getDefaultOrderFormValues = (
  initialData?: Partial<OrderFormValues>,
): OrderFormValues => ({
  customerName: "",
  deadline: "",
  status: "pending",
  paymentStatus: "unpaid",
  items: [createEmptyOrderItem()],
  notes: "",
  ...initialData,
})
