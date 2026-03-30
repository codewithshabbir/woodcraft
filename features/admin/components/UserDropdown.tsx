"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { User, Settings, ClipboardList } from "lucide-react";

import LogoutButton from "@/features/admin/components/LogoutButton";

type UserType = {
  name?: string;
  image?: string;
  role?: string;
};

const UserDropdown = ({ user }: { user?: UserType }) => {
  return (
    <DropdownMenu>
      
      {/* Trigger */}
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="h-9 w-9 ring-1 ring-border hover:ring-primary transition">
            {user?.image ? <AvatarImage src={user.image} /> : null}
            <AvatarFallback className="bg-muted text-sm font-medium">
              {user?.name?.slice(0, 2) || "WC"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent
        align="end"
        className="w-56 p-2 border border-border bg-card shadow-medium"
      >
        
        {/* User Info */}
        <DropdownMenuLabel className="px-2 py-1.5">
          <p className="text-sm font-semibold text-foreground">
            {user?.name || "Woodcraft User"}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {user?.role || "admin"}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Profile */}
        <DropdownMenuItem asChild>
          <Link
            href={ROUTES.settings.profile}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted transition"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem asChild>
          <Link
            href={ROUTES.settings.system}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted transition"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        {/* Role Based */}
        {user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.orders.new}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted transition"
            >
              <ClipboardList className="h-4 w-4" />
              <span>New Order</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Logout */}
        <div className="px-2">
          <LogoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;

