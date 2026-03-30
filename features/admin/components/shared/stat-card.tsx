"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  color?: string;
  note?: string;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
  note,
}: StatCardProps) {
  return (
    <Card className="rounded-xl border border-border shadow-sm transition hover:shadow-md">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <h2 className={cn("mt-1 text-2xl font-bold", color)}>{value}</h2>
          {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
        </div>
        <Icon className={cn("h-8 w-8 opacity-20", color)} />
      </CardContent>
    </Card>
  );
}
