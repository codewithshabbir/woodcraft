import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/admin/AppSidebar";
import TopBar from "@/components/admin/TopBar";

const layout = ({ children }:any) => {
  return (
  
      <SidebarProvider>
        <AppSidebar />
        <main className="md:w-[calc(100vw-16rem)] w-full">
          <div className="pt-20 px-6 min-h-[calc(100vh-50px)] pb-10">
            <TopBar />
            {children}
          </div>
          <div className="border-t h-12.5 flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
            © 2025 Muhammad Shabbir. All Rights Reserved.
          </div>
        </main>
      </SidebarProvider>
  );
};

export default layout;