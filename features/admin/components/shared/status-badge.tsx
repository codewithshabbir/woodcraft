"use client";

import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  toneClassName: string;
  className?: string;
};

export default function StatusBadge({
  label,
  toneClassName,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-bold uppercase",
        toneClassName,
        className,
      )}
    >
      {label}
    </span>
  );
}
