"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PrimaryButton } from "@/components/shared/PrimaryButton";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export default function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = "Back",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {action ? action : null}

      {backHref ? (
        <Link href={backHref}>
          <PrimaryButton variant="outline" className="p-5 border-primary hover:border-primary">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </PrimaryButton>
        </Link>
      ) : null}
    </div>
  );
}
