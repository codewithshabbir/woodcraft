import type { ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface PrimaryFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  control: Control<T>;
  type?: string;
  leftIcon?: ReactNode;
}

