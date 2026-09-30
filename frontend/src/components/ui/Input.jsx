import { AnimatePresence, motion } from "framer-motion";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  success,
  disabled = false,
  required = false,
  icon: Icon,
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="
            block
            text-sm
            font-semibold
            text-slate-700
            dark:text-slate-200
          "
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          {...props}
          className={`
            h-11
            w-full
            rounded-xl
            border
            bg-white
            px-4
            text-sm
            text-slate-900
            outline-none
            transition-all
            duration-200
            placeholder:text-slate-400
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            ${
              Icon
                ? "pl-11"
                : ""
            }
            ${
              error
                ? `
                  border-red-400
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-500/10
                `
                : `
                  border-slate-300
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                `
            }
            dark:bg-slate-950
            dark:text-white
            dark:placeholder:text-slate-500
            dark:disabled:bg-slate-900
            dark:border-slate-700
          `}
        />
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -4,
            }}
            className="
              text-xs
              font-medium
              text-red-500
            "
          >
            {error}
          </motion.p>
        )}

        {!error && success && (
          <motion.p
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -4,
            }}
            className="
              text-xs
              font-medium
              text-emerald-500
            "
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}