import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Truck,
  Factory,
  Users,
  ReceiptText,
  Calculator,
  BarChart3,
  Settings,
  Briefcase,
  Clock,
} from "lucide-react";

import { LucideIcon } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

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

export const sidebarConfig: SidebarConfigType = {
  admin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      submenu: [
        { title: "Overview", path: ROUTES.dashboard.overview },
        { title: "Analytics", path: ROUTES.dashboard.analytics },
      ],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      submenu: [
        { title: "New Order", path: ROUTES.orders.new },
        { title: "All Orders", path: ROUTES.orders.root },
      ],
    },
    {
      title: "Inventory",
      icon: Boxes,
      submenu: [
        { title: "Raw Materials", path: ROUTES.inventory.rawMaterials.root },
        { title: "Stock Levels", path: ROUTES.inventory.stockLevels },
        { title: "Stock History", path: ROUTES.inventory.stockHistory },
      ],
    },
    {
      title: "Suppliers",
      icon: Truck,
      submenu: [
        { title: "All Suppliers", path: ROUTES.suppliers.root },
        { title: "Add Supplier", path: ROUTES.suppliers.new },
        { title: "Purchase Records", path: ROUTES.suppliers.purchaseRecords.root },
      ],
    },
    {
      title: "Production",
      icon: Factory,
      submenu: [
        { title: "Assign Work", path: ROUTES.production.assignWork.root },
        { title: "Work Progress", path: ROUTES.production.workProgress },
        { title: "Completed Work", path: ROUTES.production.completedWork },
      ],
    },
    {
      title: "Employees",
      icon: Users,
      submenu: [
        { title: "All Employees", path: ROUTES.employees.root },
        { title: "Add Employee", path: ROUTES.employees.new },
        { title: "Work Hours", path: ROUTES.employees.workHours },
      ],
    },
    {
      title: "Billing",
      icon: ReceiptText,
      submenu: [
        { title: "Invoices", path: ROUTES.billing.invoices.root },
        { title: "Payments", path: ROUTES.billing.payments },
      ],
    },
    {
      title: "Cost Estimation",
      icon: Calculator,
      submenu: [
        { title: "Create Estimate", path: ROUTES.estimation.create },
        { title: "Estimate History", path: ROUTES.estimation.history },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      submenu: [
        { title: "Sales Report", path: ROUTES.reports.sales },
        { title: "Inventory Report", path: ROUTES.reports.inventory },
        { title: "Employee Report", path: ROUTES.reports.employees },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      submenu: [
        { title: "Profile Settings", path: ROUTES.settings.profile },
        { title: "System Settings", path: ROUTES.settings.system },
      ],
    },
  ],
  worker: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      submenu: [{ title: "Overview", path: ROUTES.dashboard.overview }],
    },
    {
      title: "My Work",
      icon: Briefcase,
      submenu: [
        { title: "Assigned Tasks", path: ROUTES.worker.tasks },
        { title: "Work Progress", path: ROUTES.worker.progress },
      ],
    },
    {
      title: "Work Hours",
      icon: Clock,
      submenu: [
        { title: "Log Hours", path: ROUTES.worker.logHours },
        { title: "My History", path: ROUTES.worker.history },
      ],
    },
    {
      title: "Materials",
      icon: Boxes,
      submenu: [{ title: "View Materials", path: ROUTES.worker.materials }],
    },
    {
      title: "Settings",
      icon: Settings,
      submenu: [{ title: "Profile Settings", path: ROUTES.settings.profile }],
    },
  ],
};
