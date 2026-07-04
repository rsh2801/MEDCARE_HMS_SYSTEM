import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:border-primary-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 dark:border-slate-700 dark:bg-dark-surface/80 dark:text-slate-200 dark:placeholder:text-slate-500 dark:ring-offset-dark-bg dark:focus-visible:border-primary-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
