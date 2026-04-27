import type { EmployeeReport, InventoryReport, OrderTimelineReport, SalesReport } from "@/types/entities/dashboard";

export type ReportFilters = {
  startDate?: string;
  endDate?: string;
};

export type GetSalesReport = (filters?: ReportFilters) => Promise<SalesReport>;
export type GetInventoryReport = (filters?: ReportFilters) => Promise<InventoryReport>;
export type GetEmployeeReport = (filters?: ReportFilters) => Promise<EmployeeReport>;
export type GetOrderTimelineReport = (filters?: ReportFilters) => Promise<OrderTimelineReport>;
