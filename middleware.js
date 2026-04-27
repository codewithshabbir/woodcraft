import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const adminPrefixes = [
  "/dashboard",
  "/orders",
  "/customers",
  "/inventory",
  "/suppliers",
  "/employees",
  "/billing",
  "/estimation",
  "/reports",
  "/expenses",
  "/api/orders",
  "/api/customers",
  "/api/materials",
  "/api/suppliers",
  "/api/employees",
  "/api/work-logs",
  "/api/invoices",
  "/api/payments",
  "/api/dashboard",
  "/api/reports",
  "/api/expenses",
  "/api/cost-estimation",
];

const employeeAllowedPrefixes = [
  "/orders",
  "/employees/work-hours",
  "/api/orders",
  "/api/work-logs",
];

const authPrefixes = ["/login", "/signin"];

export async function middleware(request) {
  const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  let session = null;
  try {
    // Use NextAuth v5 session extraction so Auth.js cookie names work on Vercel/Edge.
    session = await auth(request);
  } catch {
    session = null;
  }
  const token = session?.user ? { role: session.user.role, email: session.user.email } : null;
  const { pathname, search } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");

  const isAdminRoute = adminPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = authPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isEmployeeAllowedRoute = employeeAllowedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isEmployeeOrderApiRoute = /^\/api\/orders(\/[^/]+)?$/.test(pathname);
  const isEmployeeForbiddenOrderPage =
    token?.role === "employee" && (pathname === "/orders/new" || /^\/orders\/[^/]+\/edit$/.test(pathname));

  if (isAdminRoute && !token) {
    if (isApiRoute) {
      if (!authSecret) {
        return NextResponse.json(
          { ok: false, error: { code: "SERVER_MISCONFIGURED", message: "Auth secret is not configured.", fields: {} } },
          { status: 500 },
        );
      }
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Unauthorized.", fields: {} } },
        { status: 401 },
      );
    }
    if (!authSecret) {
      return new NextResponse("Server misconfigured: missing AUTH_SECRET.", { status: 500 });
    }
    const url = new URL("/signin", request.url);
    url.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (token?.role === "employee" && isAdminRoute && !(isEmployeeAllowedRoute || isEmployeeOrderApiRoute)) {
    if (isApiRoute) {
      return NextResponse.json(
        { ok: false, error: { code: "FORBIDDEN", message: "Forbidden.", fields: {} } },
        { status: 403 },
      );
    }
    return NextResponse.redirect(new URL("/orders", request.url));
  }

  if (isEmployeeForbiddenOrderPage) {
    return NextResponse.redirect(new URL("/orders", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL(token.role === "employee" ? "/orders" : "/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|vercel.svg|api/auth).*)"],
};
