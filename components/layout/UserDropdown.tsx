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
import { ClipboardList } from "lucide-react";

import LogoutButton from "@/components/layout/LogoutButton";

type UserType = {
  name?: string;
  email?: string;
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
        className="w-64 rounded-xl border border-border bg-card p-3 shadow-lg"
      >
        {/* User Info */}
        <DropdownMenuLabel className="px-3 py-2">
          <p className="text-sm font-semibold text-foreground">
            {user?.name || "Woodcraft User"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground capitalize">
            {user?.email || user?.role || "admin"}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Role Based */}
        {user?.role === "admin" && (
          <DropdownMenuItem asChild className="rounded-lg px-0 py-0 focus:bg-muted focus:text-foreground">
            <Link
              href={ROUTES.orders.new}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ClipboardList className="h-4 w-4" />
              <span>New Order</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Logout */}
        <div className="pt-1">
          <LogoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;

