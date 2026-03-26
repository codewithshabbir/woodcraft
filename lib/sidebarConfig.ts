import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Truck,
  Factory,
  Users,
  Calculator,
  BarChart3,
  Settings,
  Briefcase,
  Clock,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

// ✅ TYPES
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

// ✅ CONFIG (TYPED)
export const sidebarConfig: SidebarConfigType = {
  admin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      submenu: [
        { title: "Overview", path: "/dashboard" },
        { title: "Analytics", path: "/dashboard/analytics" },
      ],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      submenu: [
        { title: "New Order", path: "/orders/new" },
        { title: "All Orders", path: "/orders" },
      ],
    },
    {
      title: "Inventory",
      icon: Boxes,
      submenu: [
        { title: "Raw Materials", path: "/inventory/raw-materials" },
        { title: "Stock Levels", path: "/inventory/stock-levels" },
        { title: "Stock History", path: "/inventory/stock-history" },
      ],
    },
    {
      title: "Suppliers",
      icon: Truck,
      submenu: [
        { title: "All Suppliers", path: "/suppliers" },
        { title: "Add Supplier", path: "/suppliers/new" },
        { title: "Purchase Records", path: "/suppliers/purchase-records" },
      ],
    },
    {
      title: "Production",
      icon: Factory,
      submenu: [
        { title: "Assign Work", path: "/production/assign-work" },
        { title: "Work Progress", path: "/production/work-progress" },
        { title: "Completed Work", path: "/production/completed-work" },
      ],
    },
    {
      title: "Employees",
      icon: Users,
      submenu: [
        { title: "All Employees", path: "/employees" },
        { title: "Add Employee", path: "/employees/new" },
        { title: "Work Hours", path: "/employees/work-hours" },
      ],
    },
    {
      title: "Cost Estimation",
      icon: Calculator,
      submenu: [
        { title: "Create Estimate", path: "/estimation/new" },
        { title: "Estimate History", path: "/estimation/history" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      submenu: [
        { title: "Sales Report", path: "/reports/sales" },
        { title: "Inventory Report", path: "/reports/inventory" },
        { title: "Employee Report", path: "/reports/employees" },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      submenu: [
        { title: "Profile Settings", path: "/settings/profile" },
        { title: "System Settings", path: "/settings/system" },
      ],
    },
  ],

  worker: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      submenu: [{ title: "Overview", path: "/dashboard" }],
    },
    {
      title: "My Work",
      icon: Briefcase,
      submenu: [
        { title: "Assigned Tasks", path: "/worker/tasks" },
        { title: "Work Progress", path: "/worker/progress" },
      ],
    },
    {
      title: "Work Hours",
      icon: Clock,
      submenu: [
        { title: "Log Hours", path: "/worker/log-hours" },
        { title: "My History", path: "/worker/history" },
      ],
    },
    {
      title: "Materials",
      icon: Boxes,
      submenu: [
        { title: "View Materials", path: "/worker/materials" },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      submenu: [
        { title: "Profile Settings", path: "/settings/profile" },
      ],
    },
  ],
};