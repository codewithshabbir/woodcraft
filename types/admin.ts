export type EmployeeStatus = "Active" | "On Leave" | "Inactive"
export type InvoiceStatus = "Paid" | "Partial" | "Unpaid"
export type EstimateStatus = "Approved" | "Pending" | "Rejected"
export type TaskStatus = "Pending" | "In Progress" | "Completed"
export type OrderStatus = "pending" | "in_progress" | "completed"
export type PaymentStatus = "unpaid" | "partial" | "paid"

export type OrderItemRecord = {
  productTitle: string
  dimensions: string
  materialId: string
  quantity: number
  unitPrice: number
}

export type EmployeeRecord = {
  id: string
  name: string
  role: string
  phone: string
  activeJobs: number
  weeklyHours: number
  efficiency: number
  status: EmployeeStatus
  hourlyRate?: number
  overtimeRate?: number
  email?: string
  nationalId?: string
  joiningDate?: string
  employmentType?: string
  shift?: string
  supervisor?: string
  skills?: string[]
  notes?: string
}

export type SupplierRecord = {
  id: string
  name: string
  phone: string
  email?: string
  location: string
  materials: string[]
  notes?: string
  status?: string
}

export type InvoiceRecord = {
  id: string
  orderId: string
  customer: string
  amount: number
  paid: number
  dueDate: string
  status: InvoiceStatus
  notes?: string
}

export type EstimateRecord = {
  id: string
  customer: string
  project: string
  estimateAmount: number
  complexity: string
  status: EstimateStatus
  createdAt: string
  materials?: number
  labor?: number
  overheadPercent?: number
  profitPercent?: number
  notes?: string
}

export type WorkAssignmentRecord = {
  id: string
  worker: string
  orderId: string
  material: string
  quantity: number
  completed: number
  deadline: string
  status: TaskStatus
  priority: string
  notes?: string
}

export type PurchaseRecord = {
  id: string
  material: string
  supplier: string
  quantity: number
  unit: string
  price: number
  total: number
  date: string
  invoice: string
  notes?: string
}

export type RawMaterialRecord = {
  id: string
  name: string
  type: string
  unit: string
  costPerUnit: number
  stock: number
  threshold: number
  supplier: {
    name: string
    contact: string
    location: string
  }
  createdAt?: string
  updatedAt?: string
  notes?: string
}

export type OrderRecord = {
  id: string
  customerName: string
  totalAmount: number
  paidAmount?: number
  itemsCount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  deadline: string
  items: OrderItemRecord[]
  notes?: string
}

export type AsyncMutationResult<T> = {
  data: T
  message: string
}

