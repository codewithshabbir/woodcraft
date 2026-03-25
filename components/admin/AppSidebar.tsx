"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

import { Store, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  sidebarConfig,
  MenuItem,
  SubMenuItem,
} from "@/lib/sidebarConfig";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ✅ role type safe
type Role = keyof typeof sidebarConfig;

const AppSidebar = ({ role = "admin" }: { role?: Role }) => {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const [openItem, setOpenItem] = useState<string | null>(null);

  const menus = sidebarConfig[role];

  return (
    <Sidebar className="z-50 border-r border-border bg-card">
      
      {/* Header */}
      <SidebarHeader className="border-b h-16 px-3">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Store className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold">
              Woodcraft
            </span>
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="p-2">
        <SidebarMenu className="space-y-1">
          {menus.map((menu: MenuItem) => {
            const Icon = menu.icon;
            const hasSubmenu = menu.submenu.length > 0;

            return (
            <Collapsible key={menu.title} defaultOpen={false} className="group/collapsible">
  <SidebarMenuItem>

    <CollapsibleTrigger asChild>
      <SidebarMenuButton className="h-10 px-3 text-sm font-medium hover:bg-muted transition">
        <div className="flex items-center gap-2 w-full">
          <Icon className="h-4 w-4" />
          <span>{menu.title}</span>

          {hasSubmenu && (
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          )}
        </div>
      </SidebarMenuButton>
    </CollapsibleTrigger>

    {hasSubmenu && (
      <CollapsibleContent>
        <SidebarMenuSub className="ml-6 border-l border-border pl-2">
          {menu.submenu.map((sub) => {
            const isActive = pathname === sub.path;

            return (
              <SidebarMenuSubItem key={sub.path}>
                <SidebarMenuSubButton asChild>
                  <Link
                    href={sub.path}
                    className={`h-9 px-3 text-sm block ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {sub.title}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
          
        </SidebarMenuSub>
      </CollapsibleContent>
    )}

  </SidebarMenuItem>
</Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;