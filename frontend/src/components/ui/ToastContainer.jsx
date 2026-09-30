import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

const config = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    bar: "bg-emerald-500",
  },

  error: {
    icon: AlertCircle,
    iconColor: "text-red-500",
    bar: "bg-red-500",
  },

  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    bar: "bg-amber-500",
  },

  info: {
    icon: Info,
    iconColor: "text-blue-500",
    bar: "bg-blue-500",
  },
};

export default function ToastContainer({
  toasts,
  onClose,
}) {
  return (
    <div
      className="
        fixed
        right-4
        top-4
        z-[200]
        flex
        w-[calc(100%-2rem)]
        max-w-md
        flex-col
        gap-3
      "
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const item =
            config[toast.type] ||
            config.info;

          const Icon = item.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{
                opacity: 0,
                x: 40,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: 40,
                scale: 0.95,
              }}
              transition={{
                duration: 0.22,
                ease: "easeOut",
              }}
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-2xl
                shadow-slate-900/10
                dark:border-slate-700
                dark:bg-slate-900
                dark:shadow-black/30
              "
            >
              <div className="flex gap-3">
                <Icon
                  size={21}
                  className={`
                    mt-0.5
                    shrink-0
                    ${item.iconColor}
                  `}
                />

                <div className="min-w-0 flex-1">
                  <p className="
                    text-sm
                    font-bold
                    text-slate-900
                    dark:text-white
                  ">
                    {toast.title}
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    leading-5
                    text-slate-600
                    dark:text-slate-300
                  ">
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onClose(toast.id)
                  }
                  className="
                    h-7
                    w-7
                    shrink-0
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                    dark:hover:bg-slate-800
                    dark:hover:text-white
                  "
                  aria-label="Close notification"
                >
                  <X
                    size={15}
                    className="mx-auto"
                  />
                </button>
              </div>

              <motion.div
                initial={{
                  width: "100%",
                }}
                animate={{
                  width: "0%",
                }}
                transition={{
                  duration: 4,
                  ease: "linear",
                }}
                className={`
                  absolute
                  bottom-0
                  left-0
                  h-0.5
                  ${item.bar}
                `}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}