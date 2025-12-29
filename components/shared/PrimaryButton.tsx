import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PrimaryButtonProps } from "@/types/shared";

export function PrimaryButton({
  children,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      disabled={disabled || isLoading}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 cursor-pointer",
        "overflow-hidden px-6 py-3 font-semibold",
        "transition-all duration-300 hover:brightness-110",
        className
      )}
      {...props}
    >
      {/* Shine animation */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-0 flex justify-center
          -skew-x-12 -translate-x-full
          group-hover:translate-x-full
          duration-1000
        "
      >
        <span className="h-full w-8 bg-primary-foreground/20" />
      </span>

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex">{rightIcon}</span>}
          </>
        )}
      </span>
    </Button>
  );
}