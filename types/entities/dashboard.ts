export type DashboardSummary = {
  stats: {
    customers: number
    employees: number
    activeOrders: number
    lowQuantityAlerts: number
    totalRevenue: number
    totalExpenses: number
    outstandingInvoices: number
    inventoryValue: number
  }
  recentOrders: Array<{
    id: string
    customerId: string
    status: "pending" | "in_progress" | "completed" | "delivered"
    estimatedCost: number
    createdAt: string
  }>
}

export type DashboardAnalytics = {
  monthlyFinance: Array<{ month: string; income: number; expenses: number }>
}

export type SalesReport = {
  monthlySales: Array<{ month: string; income: number; expenses: number }>
  summary: {
    totalIncome: number
    totalExpenses: number
    net: number
    outstandingDue: number
  }
  receivables: Array<{ invoice: string; orderId: string; due: number; aging: string }>
  paymentMix: Record<string, number>
  totalProcurement: number
}

export type InventoryReport = {
  summary: {
    trackedMaterials: number
    criticalAlerts: number
    fastMovingItems: number
    inventoryValue: number
  }
  inventoryUsage: Array<{ name: string; consumed: number; remaining: string }>
  notes: string[]
}

export type EmployeeReport = {
  summary: {
    topPerformer: string
    totalWorkHours: number
  }
  performance: Array<{ name: string; role: string; jobs: number; hours: number }>
}

export type OrderTimelineReport = {
  summary: {
    completedOrders: number
    avgDays: number
    minDays: number
    maxDays: number
  }
  orders: Array<{
    id: string
    status: "pending" | "in_progress" | "completed" | "delivered"
    startDate: string | null
    endDate: string | null
    durationDays: number | null
  }>
}
