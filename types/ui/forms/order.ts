import type { OrderStatus } from "@/types/entities/admin";

export type OrderMaterialUsageInput = {
  materialId: string;
  quantityUsed: number;
};

export type OrderFormValues = {
  customerId: string;
  description: string;
  status: OrderStatus;
  startDate?: string;
  endDate?: string;
  materialsUsed: OrderMaterialUsageInput[];
};
