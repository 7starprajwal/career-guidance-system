import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

import Button from "./Button";

const modalConfig = {
  success: {
    icon: CheckCircle2,
    iconClass:
      "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
  },

  error: {
    icon: XCircle,
    iconClass:
      "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10",
  },

  warning: {
    icon: AlertTriangle,
    iconClass:
      "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10",
  },

  info: {
    icon: Info,
    iconClass:
      "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10",
  },
};

export default function Modal({ modal, onClose }) {
  const firstButtonRef = useRef(null);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const isOpen = Boolean(modal);

  /*
   * Store the element that was focused before
   * opening the modal.
   */
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;

    return () => {
      if (previousActiveElement.current?.focus) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  /*
   * Lock body scrolling while modal is open.
   */
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  /*
   * Close modal when Escape is pressed.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (modal?.closeOnEscape !== false) {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, modal, onClose]);

  /*
   * Focus first button when modal opens.
   */
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      firstButtonRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  /*
   * Basic focus trap.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (event) => {
      if (event.key !== "Tab") return;

      const container = modalRef.current;

      if (!container) return;

      const focusableElements = container.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );

      const focusable = Array.from(focusableElements);

      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) return;

    if (modal?.closeOnBackdrop !== false) {
      onClose();
    }
  };

  const handleAction = async (action) => {
    if (!action) return;

    try {
      if (action.onClick) {
        await action.onClick();
      }
    } catch (error) {
      console.error("Modal action failed:", error);
    }
  };

  const type = modal?.type || "info";

  const config = modalConfig[type] || modalConfig.info;

  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={handleBackdropClick}
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
          role="presentation"
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onMouseDown={(event) => event.stopPropagation()}
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="
                absolute
                right-4
                top-4
                z-10
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-900
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/40
                dark:text-slate-400
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
            >
              <X size={19} />
            </button>

            {/* Content */}
            <div className="px-6 pb-6 pt-7 sm:px-7">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.05,
                  duration: 0.25,
                }}
                className={`
                  mb-5
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  ${config.iconClass}
                `}
              >
                <Icon size={28} strokeWidth={2} />
              </motion.div>

              {/* Title */}
              <h2
                id="modal-title"
                className="
                  pr-8
                  text-xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                {modal?.title || "Information"}
              </h2>

              {/* Message */}
              {modal?.message && (
                <p
                  id="modal-description"
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  {modal.message}
                </p>
              )}

              {/* Custom Content */}
              {modal?.content && (
                <div className="mt-5">
                  {modal.content}
                </div>
              )}

              {/* Actions */}
              {modal?.actions?.length > 0 && (
                <div
                  className="
                    mt-7
                    flex
                    flex-col-reverse
                    gap-3
                    sm:flex-row
                    sm:justify-end
                  "
                >
                  {modal.actions.map((action, index) => (
                    <Button
                      key={`${action.label}-${index}`}
                      ref={index === 0 ? firstButtonRef : undefined}
                      type="button"
                      variant={action.variant || "primary"}
                      size="md"
                      disabled={action.disabled}
                      loading={action.loading}
                      onClick={() => handleAction(action)}
                      className="w-full sm:w-auto"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Default Close Button */}
              {!modal?.actions?.length && (
                <div className="mt-7 flex justify-end">
                  <Button
                    ref={firstButtonRef}
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}