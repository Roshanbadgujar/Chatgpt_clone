import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export const Card = ({ children, className = "", hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.03, y: -4 } : {}}
      className={clsx(
        "bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-lg p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={clsx("mb-4 font-bold text-lg text-white", className)}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={clsx("text-gray-300 text-sm sm:text-base", className)}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={clsx("mt-4 flex justify-end gap-3", className)}>
    {children}
  </div>
);
