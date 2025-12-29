import { Button } from "@/components/ui/Button";
import { ReactNode } from "react";

export interface PrimaryButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}