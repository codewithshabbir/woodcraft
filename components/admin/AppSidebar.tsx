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
import { Button } from "@/components/ui/button";
import { sidebarConfig, MenuItem } from "@/lib/sidebarConfig";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const AppSidebar = ({ role = "admin" }: { role?: keyof typeof sidebarConfig }) => {
  const { setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const menus = sidebarConfig[role];

  return (
    <Sidebar className="z-[100] border-r border-border bg-card shadow-none transition-transform duration-300 ease-in-out">
      {/* Header */}
      <SidebarHeader className="border-b border-border h-16 px-4 justify-center bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Woodcraft</span>
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="p-3 bg-card">
        <SidebarMenu className="gap-1">
          {menus.map((menu: MenuItem) => {
            const Icon = menu.icon;
            const hasSubmenu = menu.submenu && menu.submenu.length > 0;
            const isParentActive = hasSubmenu && menu.submenu.some((sub) => pathname === sub.path);

            return (
              <Collapsible key={menu.title} defaultOpen={isParentActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "h-11 px-3 rounded-lg transition-all",
                        isParentActive 
                          ? "bg-primary/10 text-primary font-bold" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-[14px]">{menu.title}</span>
                      {hasSubmenu && (
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {hasSubmenu && (
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 mt-1 border-l border-border/60 pl-2 gap-1">
                        {menu.submenu.map((sub) => {
                          const isActive = pathname === sub.path;

                          return (
                            <SidebarMenuSubItem key={sub.path}>
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <Link
                                  href={sub.path}
                                  onClick={() => isMobile && setOpenMobile(false)}
                                  className={cn(
                                    "flex h-10 items-center px-4 rounded-md text-[13px] transition-all",
                                    isActive
                                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  )}
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