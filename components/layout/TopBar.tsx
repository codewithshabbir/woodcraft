"use client";

import React from "react";
import { Search, Menu } from "lucide-react";
import UserDropdown from "@/components/layout/UserDropdown";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/helpers";

const TopBar = ({ user }: { user?: { name?: string; email?: string; role?: string; image?: string } }) => {
  const { toggleSidebar } = useSidebar();
  const isEmployee = user?.role === "employee";

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-30 flex h-16 w-full items-center border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:pl-72 md:pr-6",
        isEmployee ? "justify-end" : "justify-between",
      )}
    >
      {!isEmployee ? (
        <div className="flex w-full max-w-md items-center">
          <div className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-muted px-3 focus-within:ring-2 focus-within:ring-ring">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders, materials..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <UserDropdown user={user} />

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;

