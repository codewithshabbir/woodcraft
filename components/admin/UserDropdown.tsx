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
import {
  User,
  Settings,
  ClipboardList,
} from "lucide-react";

import LogoutButton from "@/components/admin/LogoutButton";

const UserDropdown = ({ user }:any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>
            {user?.name?.slice(0, 2) || "WC"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="me-5 w-52">
        {/* 👤 USER INFO */}
        <DropdownMenuLabel>
          <p className="font-semibold">{user?.name || "Woodcraft User"}</p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role || "admin"}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* 👤 PROFILE */}
        <DropdownMenuItem asChild>
          <Link href="/settings/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {/* ⚙ SETTINGS */}
        <DropdownMenuItem asChild>
          <Link href="/settings/system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        {/* 📋 ROLE BASED */}
        {user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/orders/new" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>New Order</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* 🚪 LOGOUT */}
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;