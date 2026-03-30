"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/features/admin/components/AppSidebar";
import TopBar from "@/features/admin/components/TopBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Area */}
      <div className="flex flex-col min-h-screen w-full">
        
        {/* TopBar */}
        <TopBar />

        {/* Content */}
        <main className="flex-1 pt-16 px-6 bg-muted">
          <div className="max-w-7xl mx-auto w-full py-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="h-12 border-t border-border flex items-center justify-center text-sm text-muted-foreground bg-background">
          © 2025 Muhammad Shabbir. All Rights Reserved.
        </footer>

      </div>
    </SidebarProvider>
  );
};

export default Layout;
