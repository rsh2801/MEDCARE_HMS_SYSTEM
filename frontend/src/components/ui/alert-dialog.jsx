import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const AlertDialogContext = React.createContext({ open: false, onOpenChange: () => {} });

function AlertDialog({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({ children, asChild, ...props }) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
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

function AlertDialogContent({ children, className, ...props }) {
  const { open, onOpenChange } = React.useContext(AlertDialogContext);
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={cn(
                "w-full max-w-md rounded-xl bg-white dark:bg-dark-surface p-6 shadow-xl border border-slate-200 dark:border-slate-700",
                className
              )}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              {...props}
            >
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AlertDialogHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-2", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-slate-100", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }) {
  return <div className={cn("mt-6 flex justify-end gap-3", className)} {...props} />;
}

function AlertDialogCancel({ children, className, ...props }) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-dark-surface dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      {children || "Cancel"}
    </button>
  );
}

function AlertDialogAction({ children, className, onClick, ...props }) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors cursor-pointer",
        className
      )}
      onClick={() => {
        onClick?.();
        onOpenChange(false);
      }}
      {...props}
    >
      {children || "Confirm"}
    </button>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
};
