import { ReactNode } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export interface LayoutProps {
  children: ReactNode;
}

export interface PrimaryFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  control: Control<T>;
  type?: string;
  leftIcon?: ReactNode;
}