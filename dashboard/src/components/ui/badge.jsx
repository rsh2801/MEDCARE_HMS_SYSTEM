import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300",
        secondary: "border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200",
        destructive: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
        outline: "text-slate-900 dark:text-slate-200",
        warning: "border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
        success: "border-transparent bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
