export type EstimationMaterialLine = {
  id: number;
  materialId: string;
  quantity: number;
};

export type EstimationLaborLine = {
  id: number;
  roleId: string;
  hours: number;
};

export type EstimationComplexity = "low" | "medium" | "high";

export type EstimationFormValues = {
  projectTitle: string;
  customerName: string;
  projectType: string;
  quantity: number;
  complexity: EstimationComplexity;
  overheadPercent: number;
  profitPercent: number;
  notes?: string;
  materials: EstimationMaterialLine[];
  labor: EstimationLaborLine[];
};

export type MaterialOption = {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  quantity: number;
};

export type LaborOption = {
  id: string;
  role: string;
  ratePerHour: number;
};
