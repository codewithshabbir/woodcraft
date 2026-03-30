"use client";

import React from "react";
import { Search, Menu } from "lucide-react";
import UserDropdown from "@/features/admin/components/UserDropdown";
import NotificationDropdown from "@/features/admin/components/NotificationDropdown";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div
      className="fixed left-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:pl-72 md:pr-6"
    >
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

      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <UserDropdown />

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

