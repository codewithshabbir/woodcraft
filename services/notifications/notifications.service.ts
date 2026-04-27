import { apiRequest } from "@/lib/client/api";
import type { NotificationItem } from "@/types/entities/notifications";

export const listNotifications = async (): Promise<NotificationItem[]> =>
  apiRequest<NotificationItem[]>("/api/notifications");

