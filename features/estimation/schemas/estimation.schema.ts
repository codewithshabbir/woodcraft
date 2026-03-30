import * as z from "zod"

export const materialLineSchema = z.object({
  id: z.number(),
  materialId: z.string().min(1),
  quantity: z.number().min(0),
})

export const laborLineSchema = z.object({
  id: z.number(),
  roleId: z.string().min(1),
  hours: z.number().min(0),
})

export const estimationFormSchema = z.object({
  projectTitle: z.string().min(2, "Project title is required"),
  customerName: z.string().min(2, "Customer name is required"),
  projectType: z.string().min(1),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  complexity: z.enum(["low", "medium", "high"]),
  overheadPercent: z.number().min(0),
  profitPercent: z.number().min(0),
  notes: z.string().optional(),
  materials: z.array(materialLineSchema).min(1, "At least one material is required"),
  labor: z.array(laborLineSchema).min(1, "At least one labor item is required"),
})

export type EstimationFormValues = z.infer<typeof estimationFormSchema>

export type MaterialOption = {
  id: string
  name: string
  unit: string
  price: number
  stock: number
}

export type LaborOption = {
  id: string
  role: string
  ratePerHour: number
}

export type MaterialLine = EstimationFormValues["materials"][number]
export type LaborLine = EstimationFormValues["labor"][number]

export const materialOptions: MaterialOption[] = [
  { id: "MAT-001", name: "Oak Wood", unit: "ft", price: 520, stock: 120 },
  { id: "MAT-002", name: "Pine Wood", unit: "ft", price: 310, stock: 85 },
  { id: "MAT-003", name: "Walnut Veneer", unit: "sheet", price: 1650, stock: 32 },
  { id: "MAT-004", name: "Wood Polish", unit: "litre", price: 900, stock: 18 },
  { id: "MAT-005", name: "Hardware Set", unit: "set", price: 1350, stock: 40 },
]

export const laborOptions: LaborOption[] = [
  { id: "LAB-001", role: "Senior Carpenter", ratePerHour: 950 },
  { id: "LAB-002", role: "Finishing Worker", ratePerHour: 700 },
  { id: "LAB-003", role: "Painter / Polisher", ratePerHour: 650 },
  { id: "LAB-004", role: "Installer", ratePerHour: 800 },
]

export const defaultEstimationFormValues: EstimationFormValues = {
  projectTitle: "",
  customerName: "",
  projectType: "custom-furniture",
  quantity: 1,
  complexity: "medium",
  overheadPercent: 10,
  profitPercent: 15,
  notes: "",
  materials: [
    { id: 1, materialId: "MAT-001", quantity: 20 },
    { id: 2, materialId: "MAT-004", quantity: 2 },
  ],
  labor: [
    { id: 1, roleId: "LAB-001", hours: 18 },
    { id: 2, roleId: "LAB-003", hours: 6 },
  ],
}
