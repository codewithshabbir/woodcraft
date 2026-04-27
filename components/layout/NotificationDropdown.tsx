"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Boxes } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";
import { ROUTES } from "@/lib/constants/routes";
import { listNotifications } from "@/services/notifications/notifications.service";
import type { NotificationItem } from "@/types/entities/notifications";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    void listNotifications()
      .then((data) => {
        if (!cancelled) {
          setNotifications(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNotifications([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-muted">
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 ? (
            <>
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-destructive" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-92 border border-border bg-card p-2 shadow-medium">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
            Notifications
          </DropdownMenuLabel>
          {notifications.length > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-medium text-primary transition hover:underline"
            >
              Mark all read
            </button>
          ) : null}
        </div>

        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="px-3 py-4 text-sm text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground">
            No active alerts. Quantity levels are above the configured thresholds.
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                asChild
                className="cursor-pointer rounded-xl p-0 focus:bg-transparent"
              >
                <Link
                  href={item.href || ROUTES.inventory.quantityLevels}
                  onClick={() => markAsRead(item.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-3 py-3 transition",
                    item.read
                      ? "border-border bg-background hover:bg-muted/60"
                      : "border-primary/15 bg-primary/[0.04] hover:bg-primary/[0.07]",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 rounded-lg p-2",
                      item.severity === "critical"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-amber-100 text-amber-600",
                    )}
                  >
                    <Boxes className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      {!item.read ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                    <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {item.createdAtLabel}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
