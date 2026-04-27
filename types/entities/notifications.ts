export type NotificationItem = {
  id: string;
  type: "low_quantity";
  title: string;
  description: string;
  href: string;
  read: boolean;
  severity: "critical" | "warning";
  createdAtLabel: string;
};
