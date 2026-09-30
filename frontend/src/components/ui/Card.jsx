import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = true,
  onClick,
}) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -3,
            }
          : {}
      }
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      onClick={onClick}
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        shadow-slate-900/[0.03]
        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-black/10
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}