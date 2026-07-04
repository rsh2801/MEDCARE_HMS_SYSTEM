import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (value === 0) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplay(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, duration, motionValue]);

  return <motion.span>{display}</motion.span>;
};

export default AnimatedCounter;
