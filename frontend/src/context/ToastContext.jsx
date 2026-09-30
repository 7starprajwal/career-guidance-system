import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import ToastContainer from "../components/ui/ToastContainer";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const counter = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) =>
      current.filter(
        (toast) => toast.id !== id
      )
    );
  }, []);

  const showToast = useCallback(
    ({
      type = "info",
      title = "Notification",
      message = "",
      duration = 4000,
    }) => {
      counter.current += 1;

      const id = `${Date.now()}-${counter.current}`;

      setToasts((current) => [
        ...current,
        {
          id,
          type,
          title,
          message,
        },
      ]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (
      message,
      title = "Success"
    ) =>
      showToast({
        type: "success",
        title,
        message,
      }),
    [showToast]
  );

  const error = useCallback(
    (
      message,
      title = "Something went wrong"
    ) =>
      showToast({
        type: "error",
        title,
        message,
      }),
    [showToast]
  );

  const warning = useCallback(
    (
      message,
      title = "Warning"
    ) =>
      showToast({
        type: "warning",
        title,
        message,
      }),
    [showToast]
  );

  const info = useCallback(
    (
      message,
      title = "Information"
    ) =>
      showToast({
        type: "info",
        title,
        message,
      }),
    [showToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      success,
      error,
      warning,
      info,
      removeToast,
    }),
    [
      toasts,
      showToast,
      success,
      error,
      warning,
      info,
      removeToast,
    ]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}