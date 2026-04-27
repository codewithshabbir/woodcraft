import type { LucideIcon } from "lucide-react";

export type SubMenuItem = {
  title: string;
  path: string;
};

export type MenuItem = {
  title: string;
  icon: LucideIcon;
  submenu: SubMenuItem[];
};

export type SidebarConfigType = {
  admin: MenuItem[];
  worker: MenuItem[];
};

export type SidebarRole = keyof SidebarConfigType | "employee";
