import { LayoutProps } from "@/types/auth";

export default function AuthLayout({ children }:LayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}