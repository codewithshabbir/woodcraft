import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Truck,
  Users,
  ReceiptText,
  Calculator,
  BarChart3,
  Wallet,
  Briefcase,
  Clock,
} from "lucide-react";

import { ROUTES } from "@/lib/constants/routes";
import type { SidebarConfigType } from "@/types/ui/sidebar";

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
      title: "Customers",
      icon: Users,
      submenu: [
        { title: "Add Customer", path: ROUTES.customers.new },
        { title: "All Customers", path: ROUTES.customers.root },
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
        { title: "Quantity Levels", path: ROUTES.inventory.quantityLevels },
      ],
    },
    {
      title: "Suppliers",
      icon: Truck,
      submenu: [
        { title: "All Suppliers", path: ROUTES.suppliers.root },
        { title: "Add Supplier", path: ROUTES.suppliers.new },
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
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      submenu: [
        { title: "Sales Report", path: ROUTES.reports.sales },
        { title: "Inventory Report", path: ROUTES.reports.inventory },
        { title: "Employee Report", path: ROUTES.reports.employees },
        { title: "Order Timelines", path: ROUTES.reports.timelines },
      ],
    },
    {
      title: "Expenses",
      icon: Wallet,
      submenu: [
        { title: "All Expenses", path: ROUTES.expenses.root },
        { title: "Add Expense", path: ROUTES.expenses.new },
      ],
    },
  ],
  worker: [
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
      submenu: [{ title: "Log Hours", path: ROUTES.worker.logHours }],
    },
  ],
};
