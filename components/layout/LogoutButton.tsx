"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
    >
      <div className="flex w-full cursor-pointer items-center gap-2.5">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </div>
    </DropdownMenuItem>
  );
};

export default LogoutButton;
