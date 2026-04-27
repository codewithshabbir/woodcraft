"use client";

import dynamic from "next/dynamic";

const AdminShell = dynamic(() => import("@/components/layout/AdminShell"), { ssr: false });

export default AdminShell;

