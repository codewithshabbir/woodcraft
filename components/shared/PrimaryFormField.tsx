'use client'

import { useId, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { PrimaryFormFieldProps } from "@/types/auth";

export const PrimaryFormField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  type = "text",
  leftIcon,
}: PrimaryFormFieldProps<T>) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputId = useId();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={inputId} className="cursor-pointer">
            {label}
          </FormLabel>

          <FormControl>
            <div className="relative">
              {leftIcon && (
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  {leftIcon}
                </span>
              )}

              <input
                {...field}
                id={inputId}
                type={
                  isPassword
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                placeholder={placeholder}
                className="w-full rounded-md border px-10 py-2 text-sm outline-none focus:border-primary"
              />

              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};