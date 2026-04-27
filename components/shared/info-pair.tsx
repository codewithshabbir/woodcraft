"use client";

import * as React from "react";
import { cn } from "@/lib/helpers";

type InfoPairProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export default function InfoPair({ label, value, className }: InfoPairProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="font-medium leading-relaxed text-foreground">{value}</div>
    </div>
  );
}
