import { AlertCircle, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/helpers"

type StatusMessageProps = {
  type: "success" | "error"
  message: string
  className?: string
}

export function StatusMessage({ type, message, className }: StatusMessageProps) {
  const isSuccess = type === "success"

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-destructive/30 bg-destructive/5 text-destructive",
        className,
      )}
    >
      {isSuccess ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{message}</span>
    </div>
  )
}
