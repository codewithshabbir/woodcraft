import type React from "react";
import { Button } from "@/components/ui/button";

export interface PrimaryButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
