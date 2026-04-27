import { apiRequest } from "@/lib/client/api";

import type { GetDashboardAnalytics, GetDashboardSummary } from "@/types/api/dashboard";
import type { AwaitedReturn } from "@/types/shared/type-utils";

export const getDashboardSummary: GetDashboardSummary = () =>
  apiRequest<AwaitedReturn<GetDashboardSummary>>("/api/dashboard/summary");

export const getDashboardAnalytics: GetDashboardAnalytics = (range = "6-months") =>
  apiRequest<AwaitedReturn<GetDashboardAnalytics>>(`/api/dashboard/analytics?range=${encodeURIComponent(range)}`);
