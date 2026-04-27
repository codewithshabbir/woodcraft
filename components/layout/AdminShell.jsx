"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";

export default function AdminShell({ children, user }) {
  return (
    <SidebarProvider>
      <AppSidebar role={user?.role || "admin"} />

      <div className="flex min-h-screen w-full flex-col">
        <TopBar user={user} />

        <main className="flex-1 bg-muted px-6 pt-16">
          <div className="mx-auto w-full max-w-7xl py-6">{children}</div>
        </main>

        <footer className="flex h-12 items-center justify-center border-t border-border bg-background text-sm text-muted-foreground">
          © 2026 Muhammad Shabbir. All Rights Reserved.
        </footer>
      </div>
    </SidebarProvider>
  );
}
