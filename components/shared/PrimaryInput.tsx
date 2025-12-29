'use client'
import * as React from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface PrimaryInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const PrimaryInput = React.forwardRef<
  HTMLInputElement,
  PrimaryInputProps
>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      type,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const [visible, setVisible] = React.useState(false);

    const isPassword = type === "password" && showPasswordToggle;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center rounded-lg",
            "border border-input bg-background",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}
        >
          {leftIcon && (
            <span className="pl-3 flex items-center text-muted-foreground">
              {leftIcon}
            </span>
          )}

          <Input
            ref={ref}
            id={inputId}
            type={isPassword ? (visible ? "text" : "password") : type}
            className={cn(
              "border-0 bg-transparent shadow-none focus-visible:ring-0",
              leftIcon && "pl-2",
              (rightIcon || isPassword) && "pr-2",
              className
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="pr-3 flex items-center cursor-pointer text-muted-foreground hover:text-foreground"
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          ) : (
            rightIcon && (
              <span className="pr-3 flex items-center text-muted-foreground">
                {rightIcon}
              </span>
            )
          )}
        </div>
      </div>
    );
  }
);

PrimaryInput.displayName = "PrimaryInput";