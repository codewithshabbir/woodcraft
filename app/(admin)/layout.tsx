import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import AdminShell from "@/components/layout/AdminShellClientOnly";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
