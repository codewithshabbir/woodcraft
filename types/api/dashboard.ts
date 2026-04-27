import type { DashboardAnalytics, DashboardSummary } from "@/types/entities/dashboard";

export type GetDashboardSummary = () => Promise<DashboardSummary>;
export type GetDashboardAnalytics = (range?: string) => Promise<DashboardAnalytics>;
