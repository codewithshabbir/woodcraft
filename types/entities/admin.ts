export type OrderStatus = "pending" | "in_progress" | "completed" | "delivered"

export type EmployeeRecord = {
  id: string
  name: string
  email: string
  password?: string
  role: "employee"
  employeeType: string
  hourlyRate: number
  createdAt?: string
}

export type SupplierRecord = {
  id: string
  name: string
  phone: string
  email: string
  location: string
}

export type CustomerRecord = {
  id: string
  name: string
  phone: string
  email: string
  address: string
}

export type InvoiceRecord = {
  _id?: string
  id: string
  orderId: string
  totalAmount: number
  totalPaid: number
  remainingBalance: number
  generatedDate: string
  status: "Unpaid" | "Partial" | "Paid"
}

export type PaymentRecord = {
  _id?: string
  id: string
  invoiceId: string
  amount: number
  paymentDate: string
}

export type RawMaterialRecord = {
  id: string
  name: string
  unit: string
  pricePerUnit: number
  quantity: number
  threshold: number
  createdAt?: string
  updatedAt?: string
}

export type OrderRecord = {
  _id?: string
  id: string
  customerId: string
  description: string
  status: OrderStatus
  estimatedCost: number
  materialsUsed: Array<{
    materialId: string
    quantityUsed: number
    name?: string
    priceAtTime?: number
  }>
  actualCost?: number
  startDate?: string
  endDate?: string
  warnings?: Array<{ materialId: string; message: string }>
}

export type WorkLogRecord = {
  id: string
  userId: string
  orderId: string
  taskDescription?: string
  progress?: number
  hoursWorked: number
  workDate: string
  status: "pending" | "approved" | "rejected"
  wage: number
  approvedBy?: string
  approvedAt?: string
  userName?: string
  orderLabel?: string
}

export type ExpenseRecord = {
  id: string
  type: string
  amount: number
  date: string
  notes?: string
  orderId?: string
  materialId?: string
  userId?: string
}

export type AsyncMutationResult<T> = {
  data: T
  message: string
}
