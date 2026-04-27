import { apiRequest } from "@/lib/client/api";

import type { GetEmployeeReport, GetInventoryReport, GetOrderTimelineReport, GetSalesReport, ReportFilters } from "@/types/api/reports";
import type { AwaitedReturn } from "@/types/shared/type-utils";

function buildReportPath(path: string, filters: ReportFilters = {}) {
  const searchParams = new URLSearchParams();
  if (filters.startDate) {
    searchParams.set("startDate", filters.startDate);
  }
  if (filters.endDate) {
    searchParams.set("endDate", filters.endDate);
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export const getSalesReport: GetSalesReport = (filters = {}) =>
  apiRequest<AwaitedReturn<GetSalesReport>>(buildReportPath("/api/reports/sales", filters));

export const getInventoryReport: GetInventoryReport = (filters = {}) =>
  apiRequest<AwaitedReturn<GetInventoryReport>>(buildReportPath("/api/reports/inventory", filters));

export const getEmployeeReport: GetEmployeeReport = (filters = {}) =>
  apiRequest<AwaitedReturn<GetEmployeeReport>>(buildReportPath("/api/reports/employees", filters));

export const getOrderTimelineReport: GetOrderTimelineReport = (filters = {}) =>
  apiRequest<AwaitedReturn<GetOrderTimelineReport>>(buildReportPath("/api/reports/timelines", filters));
