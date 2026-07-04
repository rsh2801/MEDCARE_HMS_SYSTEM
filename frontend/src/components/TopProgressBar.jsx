import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const TopProgressBar = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 z-[100]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
};

export default TopProgressBar;
