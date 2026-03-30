export const ROUTES = {
  auth: {
    signin: "/signin",
    signup: "/signup",
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
  inventory: {
    rawMaterials: {
      root: "/inventory/raw-materials",
      new: "/inventory/raw-materials/new",
      detail: (id: string) => `/inventory/raw-materials/${id}`,
      edit: (id: string) => `/inventory/raw-materials/${id}/edit`,
    },
    stockLevels: "/inventory/stock-levels",
    stockHistory: "/inventory/stock-history",
  },
  suppliers: {
    root: "/suppliers",
    new: "/suppliers/new",
    detail: (id: string) => `/suppliers/${id}`,
    edit: (id: string) => `/suppliers/${id}/edit`,
    purchaseRecords: {
      root: "/suppliers/purchase-records",
      new: "/suppliers/purchase-records/new",
      detail: (id: string) => `/suppliers/purchase-records/${id}`,
    },
  },
  production: {
    assignWork: {
      root: "/production/assign-work",
      new: "/production/assign-work/new",
      detail: (id: string) => `/production/assign-work/${id}`,
      edit: (id: string) => `/production/assign-work/${id}/edit`,
    },
    workProgress: "/production/work-progress",
    completedWork: "/production/completed-work",
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
    history: "/estimation/history",
    detail: (id: string) => `/estimation/${id}`,
    edit: (id: string) => `/estimation/${id}/edit`,
  },
  reports: {
    sales: "/reports/sales",
    inventory: "/reports/inventory",
    employees: "/reports/employees",
  },
  settings: {
    profile: "/settings/profile",
    system: "/settings/system",
  },
  worker: {
    tasks: "/worker/tasks",
    progress: "/worker/progress",
    logHours: "/worker/log-hours",
    history: "/worker/history",
    materials: "/worker/materials",
  },
} as const

export const WOODCRAFT_SIGNIN = ROUTES.auth.signin
export const WOODCRAFT_SIGNUP = ROUTES.auth.signup
