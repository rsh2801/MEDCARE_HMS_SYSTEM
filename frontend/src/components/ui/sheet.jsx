import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const SheetContext = React.createContext({ open: false, onOpenChange: () => {} });

function Sheet({ open, onOpenChange, children }) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({ children, asChild, ...props }) {
  const { onOpenChange } = React.useContext(SheetContext);
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e);
        onOpenChange(true);
      },
    });
  }
  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

function SheetContent({ children, className, side = "left", ...props }) {
  const { open, onOpenChange } = React.useContext(SheetContext);

  const slideVariants = {
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  };

  const variant = slideVariants[side] || slideVariants.left;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            className={cn(
              "fixed z-50 bg-white p-6 shadow-lg dark:bg-dark-surface dark:border-slate-700",
              side === "left" && "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
              side === "right" && "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
              className
            )}
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            {...props}
          >
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 dark:text-slate-400"
              onClick={() => onOpenChange(false)}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
}

function SheetTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-slate-100", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle };
