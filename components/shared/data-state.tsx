import { AlertCircle, Inbox, Loader2 } from "lucide-react"

import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { cn } from "@/lib/utils"

type DataStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  tone?: "default" | "error"
  className?: string
}

export function LoadingState({ title = "Loading data..." }: { title?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
    </div>
  )
}

export function EmptyState({ title, description, actionLabel, onAction, className }: DataStateProps) {
  return (
    <div className={cn("flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center", className)}>
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <p className="mt-4 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <PrimaryButton type="button" variant="outline" className="mt-4 p-5 border-primary hover:border-primary" onClick={onAction}>
          {actionLabel}
        </PrimaryButton>
      ) : null}
    </div>
  )
}

export function ErrorState({ title, description, actionLabel, onAction, className }: DataStateProps) {
  return (
    <div className={cn("flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 p-6 text-center", className)}>
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="mt-4 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <PrimaryButton type="button" variant="destructive" className="mt-4 p-5" onClick={onAction}>
          {actionLabel}
        </PrimaryButton>
      ) : null}
    </div>
  )
}
