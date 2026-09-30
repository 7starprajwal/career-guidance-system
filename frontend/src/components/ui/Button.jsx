import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary: `
    bg-blue-600
    text-white
    shadow-sm
    shadow-blue-600/20
    hover:bg-blue-700
    hover:shadow-lg
    hover:shadow-blue-600/20
  `,

  secondary: `
    bg-slate-100
    text-slate-900
    hover:bg-slate-200
    dark:bg-slate-800
    dark:text-white
    dark:hover:bg-slate-700
  `,

  outline: `
    border
    border-slate-300
    bg-transparent
    text-slate-700
    hover:bg-slate-50
    hover:border-slate-400
    dark:border-slate-700
    dark:text-slate-200
    dark:hover:bg-slate-800
  `,

  ghost: `
    bg-transparent
    text-slate-600
    hover:bg-slate-100
    hover:text-slate-900
    dark:text-slate-300
    dark:hover:bg-slate-800
    dark:hover:text-white
  `,

  danger: `
    bg-red-600
    text-white
    shadow-sm
    shadow-red-600/20
    hover:bg-red-700
    hover:shadow-lg
  `,
};

const sizes = {
  sm: "h-9 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-5 text-sm rounded-xl",
  xl: "h-14 px-6 text-base rounded-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  type = "button",
  className = "",
  onClick,
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={
        !disabled && !loading
          ? {
              y: -1,
              scale: 1.01,
            }
          : {}
      }
      whileTap={
        !disabled && !loading
          ? {
              scale: 0.97,
            }
          : {}
      }
      transition={{
        duration: 0.16,
      }}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        font-semibold
        transition
        duration-200
        focus:outline-none
        focus-visible:ring-4
        focus-visible:ring-blue-500/20
        disabled:pointer-events-none
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading ? (
        <Loader2
          size={17}
          className="animate-spin"
        />
      ) : (
        Icon && <Icon size={17} />
      )}

      {children}

      {!loading && IconRight && (
        <IconRight size={17} />
      )}
    </motion.button>
  );
}