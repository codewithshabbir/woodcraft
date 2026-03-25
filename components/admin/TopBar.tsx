"use client";

import React from "react";
import { Search, Bell, Menu } from "lucide-react";
import UserDropdown from "@/components/admin/UserDropdown";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div
      className="fixed top-0 left-0 z-30 h-16 w-full border-b border-border
      bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60
      flex items-center justify-between
      px-4 md:pl-72 md:pr-6"
    >
      
      {/* 🔍 SEARCH */}
      <div className="flex items-center w-full max-w-md">
        <div
          className="flex items-center gap-2 w-full rounded-md border border-input 
          bg-muted px-3 h-9 focus-within:ring-2 focus-within:ring-ring"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders, materials..."
            className="w-full bg-transparent outline-none text-sm 
            placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* 🔔 RIGHT SIDE */}
      <div className="flex items-center gap-2">
        
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted"
        >
          <Bell className="h-5 w-5 text-foreground" />

          {/* Badge */}
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"
          />
        </Button>

        {/* User */}
        <UserDropdown />

        {/* Mobile Menu */}
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