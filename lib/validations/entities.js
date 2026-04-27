import { z } from "zod";

const positiveNumber = z.coerce.number().min(0);
const strictlyPositiveNumber = z.coerce.number().gt(0, "Must be > 0");
const nonEmptyString = z.string().trim().min(1);

export const customerSchema = z.object({
  name: nonEmptyString,
  phone: nonEmptyString,
  email: z.string().trim().min(1).email(),
  address: nonEmptyString,
});

export const supplierSchema = z.object({
  name: nonEmptyString,
  phone: nonEmptyString,
  email: z.string().trim().email().or(z.literal("")).optional().default(""),
  location: nonEmptyString,
});

export const employeeSchema = z.object({
  name: nonEmptyString,
  email: z.string().trim().email(),
  password: nonEmptyString.min(6, "Must be at least 6 characters"),
  employeeType: nonEmptyString,
  hourlyRate: positiveNumber,
});

export const materialSchema = z.object({
  supplierId: nonEmptyString,
  name: nonEmptyString,
  unit: nonEmptyString,
  pricePerUnit: positiveNumber,
  quantity: positiveNumber,
  threshold: positiveNumber.default(0),
});

export const orderSchema = z.object({
  customerId: nonEmptyString,
  description: nonEmptyString,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  materialsUsed: z.array(
    z.object({
      materialId: nonEmptyString,
      quantityUsed: strictlyPositiveNumber,
    }),
  ).min(1),
});

export const invoiceSchema = z.object({
  orderId: nonEmptyString.regex(/^ORD-\d{3,}$/i, "Invalid orderId"),
}).strict();

export const paymentSchema = z.object({
  invoiceId: nonEmptyString.regex(/^INV-\d{3,}$/i, "Invalid invoiceId"),
  amount: strictlyPositiveNumber,
  paymentDate: nonEmptyString.refine((value) => !Number.isNaN(Date.parse(value)), "Invalid paymentDate"),
}).strict();

export const workLogSchema = z.object({
  userId: z.string().trim().optional().default(""),
  orderId: nonEmptyString,
  taskDescription: z.string().optional().default(""),
  progress: positiveNumber.max(100).optional().default(0),
  hoursWorked: strictlyPositiveNumber,
  workDate: nonEmptyString.refine((value) => !Number.isNaN(Date.parse(value)), "Invalid workDate"),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  wage: positiveNumber.default(0),
});

export const expenseSchema = z.object({
  type: nonEmptyString,
  amount: strictlyPositiveNumber,
  date: nonEmptyString.refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date"),
  notes: z.string().optional().default(""),
  orderId: z.string().trim().optional().default(""),
  materialId: z.string().trim().optional().default(""),
  userId: z.string().trim().optional().default(""),
});

export const partialSchemas = {
  customer: customerSchema.partial(),
  supplier: supplierSchema.partial(),
  employee: employeeSchema.partial(),
  material: materialSchema.omit({ supplierId: true }).partial(),
  order: orderSchema.partial(),
  invoice: invoiceSchema.partial(),
  payment: paymentSchema.partial(),
  workLog: workLogSchema.partial(),
  expense: expenseSchema.partial(),
};
