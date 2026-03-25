"use client";
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
import { Button } from "@/components/ui/Button";
import { sidebarConfig } from "@/lib/sidebarConfig";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

const AppSidebar = ({ role = "admin" }) => {
  const { toggleSidebar } = useSidebar();

  // 🔥 FIX: role-based menu
  const menus = sidebarConfig[role] || [];

  return (
    <Sidebar className="z-50">
      <SidebarHeader className="border-b h-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
              <Store className="h-5 w-5 text-white" />
            </span>
            <span className="text-2xl font-bold uppercase">
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
            <X />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu>
          {menus.map((menu, index) => {
            const Icon = menu.icon;

            return (
              <Collapsible key={index} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="px-2 py-5 font-semibold">
                      <div className="flex items-center gap-2 w-full">
                        <Icon className="h-4 w-4" />
                        <span>{menu.title}</span>

                        {menu.submenu?.length > 0 && (
                          <ChevronRight
                            className="ml-auto transition-transform duration-200
                            group-data-[state=open]/collapsible:rotate-90"
                          />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {menu.submenu?.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.submenu.map((sub, i) => (
                          <SidebarMenuSubItem key={i}>
                            <SidebarMenuSubButton asChild className="px-2 py-5">
                              <Link href={sub.path}>
                                <span>{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
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