import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        webapp: "border-transparent bg-webapp/20 text-webapp",
        workflow: "border-transparent bg-workflow/20 text-workflow",
        video: "border-transparent bg-video/20 text-video",
        image: "border-transparent bg-image/20 text-image",
        social: "border-border/50 bg-muted/50 text-muted-foreground",
        // Status colors
        pending: "border-transparent bg-yellow-500/20 text-yellow-300",
        progress: "border-transparent bg-blue-500/20 text-blue-300",
        posting: "border-transparent bg-green-500/20 text-green-300",
        rejected: "border-transparent bg-red-500/20 text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

