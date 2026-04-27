export const ROUTES = {
  auth: {
    signin: "/signin",
    forgotPassword: "/forgot-password",
  },
  dashboard: {
    overview: "/dashboard",
    analytics: "/dashboard/analytics",
  },
  orders: {
    root: "/orders",
    new: "/orders/new",
    detail: (id: string) => `/orders/${id}`,
    edit: (id: string) => `/orders/${id}/edit`,
  },
  customers: {
    root: "/customers",
    new: "/customers/new",
    detail: (id: string) => `/customers/${id}`,
    edit: (id: string) => `/customers/${id}/edit`,
  },
  inventory: {
    rawMaterials: {
      root: "/inventory/raw-materials",
      new: "/inventory/raw-materials/new",
      detail: (id: string) => `/inventory/raw-materials/${id}`,
      edit: (id: string) => `/inventory/raw-materials/${id}/edit`,
    },
    quantityLevels: "/inventory/quantity-levels",
  },
  suppliers: {
    root: "/suppliers",
    new: "/suppliers/new",
    detail: (id: string) => `/suppliers/${id}`,
    edit: (id: string) => `/suppliers/${id}/edit`,
  },
  employees: {
    root: "/employees",
    new: "/employees/new",
    workHours: "/employees/work-hours",
    detail: (id: string) => `/employees/${id}`,
    edit: (id: string) => `/employees/${id}/edit`,
  },
  billing: {
    invoices: {
      root: "/billing/invoices",
      detail: (id: string) => `/billing/invoices/${id}`,
    },
    payments: "/billing/payments",
  },
  estimation: {
    create: "/estimation/new",
  },
  reports: {
    sales: "/reports/sales",
    inventory: "/reports/inventory",
    employees: "/reports/employees",
    timelines: "/reports/timelines",
  },
  expenses: {
    root: "/expenses",
    new: "/expenses/new",
  },
  worker: {
    tasks: "/orders",
    progress: "/orders/progress",
    logHours: "/employees/work-hours",
    history: "/employees/work-hours",
    materials: "/inventory/quantity-levels",
  },
} as const

export const WOODCRAFT_SIGNIN = ROUTES.auth.signin
