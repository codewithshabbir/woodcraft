"use client";

import React from "react";
import { Search, Bell, Menu } from "lucide-react";
import UserDropdown from "@/components/admin/UserDropdown";
import { Button } from "@/components/ui/Button";
import { useSidebar } from "@/components/ui/sidebar";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div
      className="fixed top-0 left-0 z-30 h-16 w-full border-b
      bg-white dark:bg-card
      flex items-center justify-between
      px-4 md:pl-72 md:pr-6"
    >
      {/* 🔍 LEFT SIDE — SEARCH */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <Search className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search orders, materials..."
          className="w-full bg-transparent outline-none text-sm
          placeholder:text-gray-400"
        />
      </div>

      {/* 🔔 RIGHT SIDE */}
      <div className="flex items-center gap-3">
        
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          
          {/* Notification Badge */}
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
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