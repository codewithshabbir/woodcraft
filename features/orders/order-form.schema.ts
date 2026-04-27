import * as z from "zod";

import type { OrderFormValues, OrderMaterialUsageInput } from "@/types/ui/forms/order";

export const materialUsageSchema = z.object({
  materialId: z.string().min(1, "Material is required"),
  quantityUsed: z.number().gt(0, "Quantity must be > 0"),
});

export const orderFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "in_progress", "completed", "delivered"]),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  materialsUsed: z.array(materialUsageSchema).min(1, "At least one material is required"),
});

export const createEmptyMaterialUsage = (): OrderMaterialUsageInput => ({
  materialId: "",
  quantityUsed: 1,
});

export const getDefaultOrderFormValues = (initialData?: Partial<OrderFormValues>): OrderFormValues => ({
  customerId: "",
  description: "",
  status: "pending",
  startDate: "",
  endDate: "",
  materialsUsed: [createEmptyMaterialUsage()],
  ...initialData,
});
