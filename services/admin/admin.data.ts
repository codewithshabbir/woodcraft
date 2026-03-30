import type {
  EmployeeRecord,
  EstimateRecord,
  InvoiceRecord,
  OrderRecord,
  PurchaseRecord,
  RawMaterialRecord,
  SupplierRecord,
  WorkAssignmentRecord,
} from "@/types/admin"

export const employeeRecords: EmployeeRecord[] = [
  {
    id: "EMP-001",
    name: "Ali Raza",
    role: "Senior Carpenter",
    phone: "+92 301 2004455",
    activeJobs: 4,
    weeklyHours: 46,
    efficiency: 94,
    status: "Active",
    hourlyRate: 950,
    notes: "Handles premium furniture jobs and supervises frame assembly.",
  },
  {
    id: "EMP-002",
    name: "Sajid Iqbal",
    role: "Finishing Worker",
    phone: "+92 300 8877331",
    activeJobs: 3,
    weeklyHours: 39,
    efficiency: 86,
    status: "Active",
    hourlyRate: 820,
    notes: "Specializes in polish, finishing, and final visual quality checks.",
  },
  {
    id: "EMP-003",
    name: "Usman Tariq",
    role: "Installer",
    phone: "+92 321 4455671",
    activeJobs: 1,
    weeklyHours: 24,
    efficiency: 71,
    status: "On Leave",
    hourlyRate: 780,
    notes: "Handles site installation and customer handover coordination.",
  },
]

export const supplierRecords: SupplierRecord[] = [
  {
    id: "SUP-001",
    name: "ABC Traders",
    phone: "+92 300 1234567",
    email: "abc@traders.com",
    location: "Karachi",
    materials: ["Oak Wood", "Pine Wood", "Hardware Sets"],
    notes: "Reliable for urgent workshop restocks.",
    status: "Active Supplier",
  },
  {
    id: "SUP-002",
    name: "Wood Masters",
    phone: "+92 311 9876543",
    email: "sales@woodmasters.com",
    location: "Lahore",
    materials: ["Walnut Sheets", "MDF Boards", "Drawer Channels"],
    notes: "Preferred supplier for board materials and cabinet accessories.",
    status: "Active Supplier",
  },
]

export const orderRecords: OrderRecord[] = [
  {
    id: "ORD-001",
    customerName: "Ali Khan",
    totalAmount: 45000,
    paidAmount: 22500,
    itemsCount: 2,
    status: "in_progress",
    paymentStatus: "partial",
    deadline: "2026-04-10",
    items: [
      {
        productTitle: "Dining Table",
        dimensions: "6x3 ft",
        materialId: "MAT-001",
        quantity: 1,
        unitPrice: 28000,
      },
      {
        productTitle: "Dining Bench",
        dimensions: "5x1.5 ft",
        materialId: "MAT-002",
        quantity: 1,
        unitPrice: 17000,
      },
    ],
    notes: "Polish pending before final delivery.",
  },
  {
    id: "ORD-002",
    customerName: "Ahmed Raza",
    totalAmount: 25000,
    paidAmount: 25000,
    itemsCount: 5,
    status: "completed",
    paymentStatus: "paid",
    deadline: "2026-04-05",
    items: [
      {
        productTitle: "Wall Shelves",
        dimensions: "3x1 ft",
        materialId: "MAT-002",
        quantity: 5,
        unitPrice: 5000,
      },
    ],
    notes: "Delivered and installed.",
  },
  {
    id: "ORD-003",
    customerName: "Ayesha Interiors",
    totalAmount: 185000,
    paidAmount: 0,
    itemsCount: 3,
    status: "pending",
    paymentStatus: "unpaid",
    deadline: "2026-04-12",
    items: [
      {
        productTitle: "Reception Desk",
        dimensions: "8x2.5 ft",
        materialId: "MAT-001",
        quantity: 1,
        unitPrice: 95000,
      },
      {
        productTitle: "Storage Cabinet",
        dimensions: "6x2 ft",
        materialId: "MAT-002",
        quantity: 1,
        unitPrice: 55000,
      },
      {
        productTitle: "Display Shelf",
        dimensions: "5x1.5 ft",
        materialId: "MAT-002",
        quantity: 1,
        unitPrice: 35000,
      },
    ],
    notes: "Awaiting production start approval.",
  },
]

export const invoiceRecords: InvoiceRecord[] = [
  {
    id: "INV-001",
    orderId: "ORD-102",
    customer: "Nova Studio",
    amount: 136000,
    paid: 80000,
    dueDate: "2026-04-04",
    status: "Partial",
    notes: "Client requested phased payment against installation milestones.",
  },
  {
    id: "INV-002",
    orderId: "ORD-096",
    customer: "Adeel House",
    amount: 78000,
    paid: 78000,
    dueDate: "2026-03-27",
    status: "Paid",
    notes: "Invoice fully cleared before delivery dispatch.",
  },
  {
    id: "INV-003",
    orderId: "ORD-104",
    customer: "Ayesha Interiors",
    amount: 185000,
    paid: 60000,
    dueDate: "2026-04-10",
    status: "Unpaid",
    notes: "Balance to be cleared before final installation.",
  },
]

export const estimateRecords: EstimateRecord[] = [
  {
    id: "EST-001",
    customer: "Ayesha Interiors",
    project: "Reception Desk",
    estimateAmount: 172500,
    complexity: "High",
    status: "Approved",
    createdAt: "2026-03-28",
    materials: 112500,
    labor: 42000,
  },
  {
    id: "EST-002",
    customer: "Imran Khan",
    project: "Dining Set",
    estimateAmount: 86500,
    complexity: "Medium",
    status: "Pending",
    createdAt: "2026-03-29",
    materials: 54000,
    labor: 21000,
  },
  {
    id: "EST-003",
    customer: "Sana Homes",
    project: "Wardrobe Repair",
    estimateAmount: 24000,
    complexity: "Low",
    status: "Rejected",
    createdAt: "2026-03-27",
    materials: 12000,
    labor: 8000,
  },
]

export const workAssignmentRecords: WorkAssignmentRecord[] = [
  {
    id: "AW-001",
    worker: "Ali Raza",
    orderId: "ORD-104",
    material: "Oak Wood Panels",
    quantity: 10,
    completed: 4,
    deadline: "2026-04-05",
    status: "In Progress",
    priority: "High",
    notes: "Finish frame assembly first, then move to edge polish and fitting.",
  },
  {
    id: "AW-002",
    worker: "Sajid Iqbal",
    orderId: "ORD-102",
    material: "Steel Rod",
    quantity: 5,
    completed: 3,
    deadline: "2026-04-02",
    status: "In Progress",
    priority: "Medium",
    notes: "Keep finishing quality aligned with the showroom standard.",
  },
  {
    id: "AW-003",
    worker: "Usman Tariq",
    orderId: "ORD-096",
    material: "Hardware Fittings",
    quantity: 8,
    completed: 8,
    deadline: "2026-04-01",
    status: "Completed",
    priority: "Medium",
    notes: "Installation completed and checked against client punch list.",
  },
]

export const purchaseRecords: PurchaseRecord[] = [
  {
    id: "PR-001",
    material: "Oak Wood",
    supplier: "ABC Traders",
    quantity: 50,
    unit: "ft",
    price: 500,
    total: 25000,
    date: "2026-03-20",
    invoice: "INV-245",
    notes: "Delivered in good condition and added to central stock.",
  },
  {
    id: "PR-002",
    material: "Drawer Channels",
    supplier: "Wood Masters",
    quantity: 30,
    unit: "sets",
    price: 350,
    total: 10500,
    date: "2026-03-24",
    invoice: "INV-301",
    notes: "Received for cabinet production batch.",
  },
]

export const rawMaterialRecords: RawMaterialRecord[] = [
  {
    id: "MAT-001",
    name: "Teak Wood",
    type: "Wood",
    unit: "Cubic Feet",
    costPerUnit: 2500,
    stock: 120,
    threshold: 50,
    supplier: {
      name: "ABC Traders",
      contact: "+92 300 1234567",
      location: "Karachi, Pakistan",
    },
    createdAt: "12 Mar 2026",
    updatedAt: "20 Mar 2026",
    notes: "High quality imported wood for premium furniture. Store in dry conditions.",
  },
  {
    id: "MAT-002",
    name: "Walnut Sheet",
    type: "Board",
    unit: "sheet",
    costPerUnit: 1650,
    stock: 32,
    threshold: 10,
    supplier: {
      name: "Wood Masters",
      contact: "+92 311 9876543",
      location: "Lahore, Pakistan",
    },
    createdAt: "10 Mar 2026",
    updatedAt: "18 Mar 2026",
    notes: "Used in wardrobe shutters and premium cabinet facades.",
  },
]

export const getEmployeeById = (id: string) => employeeRecords.find((item) => item.id === id) ?? employeeRecords[0]
export const getSupplierById = (id: string) => supplierRecords.find((item) => item.id === id) ?? supplierRecords[0]
export const getOrderById = (id: string) => orderRecords.find((item) => item.id === id) ?? orderRecords[0]
export const getInvoiceById = (id: string) => invoiceRecords.find((item) => item.id === id) ?? invoiceRecords[0]
export const getEstimateById = (id: string) => estimateRecords.find((item) => item.id === id) ?? estimateRecords[0]
export const getWorkAssignmentById = (id: string) => workAssignmentRecords.find((item) => item.id === id) ?? workAssignmentRecords[0]
export const getPurchaseRecordById = (id: string) => purchaseRecords.find((item) => item.id === id) ?? purchaseRecords[0]
export const getRawMaterialById = (id: string) => rawMaterialRecords.find((item) => item.id === id) ?? rawMaterialRecords[0]
