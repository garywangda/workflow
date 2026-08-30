import { forwardRef, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AppIconButtonProps extends Omit<ComponentProps<typeof Button>, "children"> {
  label: string;
  tooltip?: string;
  children: ComponentProps<typeof Button>["children"];
}

export const AppIconButton = forwardRef<HTMLButtonElement, AppIconButtonProps>(function AppIconButton(
  { label, tooltip = label, className, children, ...props },
  ref,
) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button ref={ref} aria-label={label} size="icon" variant="ghost" className={cn("size-11", className)} {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
