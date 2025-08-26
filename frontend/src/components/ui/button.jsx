import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg focus:outline-none";

  const variants = {
    primary:
      "bg-pink-500 text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(236,72,153,0.7)]",
    secondary:
      "bg-transparent border border-pink-400 text-pink-400 hover:bg-pink-500/20 hover:scale-105",
    ghost:
      "bg-transparent text-gray-300 hover:text-pink-400 hover:scale-105",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
