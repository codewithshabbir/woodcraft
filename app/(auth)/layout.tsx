import { LayoutProps } from "@/types/auth";

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,oklch(0.95_0.02_85),transparent_70%)]" />

      {/* Card */}
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-medium">
        {children}
      </div>
    </div>
  );
}