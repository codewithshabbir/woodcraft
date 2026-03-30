"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Boxes,
  Briefcase,
  FileWarning,
  ReceiptText,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  href: string;
  read: boolean;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-low-stock",
    title: "Low stock detected",
    description: "Pine Wood is below reorder level and needs restocking.",
    time: "5 min ago",
    href: ROUTES.inventory.stockLevels,
    read: false,
    icon: Boxes,
    tone: "text-amber-600 bg-amber-100",
  },
  {
    id: "notif-payment-due",
    title: "Invoice payment pending",
    description: "Invoice INV-003 still has an outstanding balance.",
    time: "18 min ago",
    href: ROUTES.billing.invoices.root,
    read: false,
    icon: ReceiptText,
    tone: "text-rose-600 bg-rose-100",
  },
  {
    id: "notif-task-delay",
    title: "Task needs review",
    description: "Assigned work AW-001 is still in progress near deadline.",
    time: "42 min ago",
    href: ROUTES.production.workProgress,
    read: true,
    icon: Briefcase,
    tone: "text-sky-600 bg-sky-100",
  },
  {
    id: "notif-estimate",
    title: "Estimate awaiting confirmation",
    description: "Dining Set quotation is pending approval from admin.",
    time: "1 hr ago",
    href: ROUTES.estimation.history,
    read: true,
    icon: FileWarning,
    tone: "text-primary bg-primary/10",
  },
];

export default function NotificationDropdown() {
  const [notifications, setNotifications] = React.useState(initialNotifications);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      })),
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item,
      ),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl hover:bg-muted"
        >
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <>
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-destructive" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-92 border border-border bg-card p-2 shadow-medium"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
            Notifications
          </DropdownMenuLabel>
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs font-medium text-primary transition hover:underline"
          >
            Mark all read
          </button>
        </div>

        <DropdownMenuSeparator />

        <div className="space-y-1">
          {notifications.map((item) => (
            <DropdownMenuItem
              key={item.id}
              asChild
              className="cursor-pointer rounded-xl p-0 focus:bg-transparent"
            >
              <Link
                href={item.href}
                onClick={() => markAsRead(item.id)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-3 py-3 transition",
                  item.read
                    ? "border-border bg-background hover:bg-muted/60"
                    : "border-primary/15 bg-primary/[0.04] hover:bg-primary/[0.07]",
                )}
              >
                <div className={cn("mt-0.5 rounded-lg p-2", item.tone)}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    {!item.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
