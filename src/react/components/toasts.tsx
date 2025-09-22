import React, { useState, useRef, ReactNode, useLayoutEffect } from "react";
// import { createPortal } from "react-dom";
import styles from "./styles/toasts.module.css";
import { /*createWrapperAndAppendToBody,*/ ClientOnly, ReactPortal } from "../utils";

interface Toast {
  id: number;
  message: string;
  type: "info" | "success" | "error" | "warning";
  isVisible: boolean;
}

interface ToastContextProps {
  addToast: (
    message: string,
    type?: "info" | "success" | "error" | "warning",
    duration?: number
  ) => void;
}

const ToastContext = React.createContext<ToastContextProps | undefined>(
  undefined
);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<number, NodeJS.Timeout>>({});
  const remainingTimes = useRef<Record<number, number>>({});
  const startTimes = useRef<Record<number, number>>({});
  const isHovering = useRef<boolean>(false);

  const addToast = (
    message: string,
    type: "info" | "success" | "error" | "warning" = "info",
    duration: number = 3000
  ) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, isVisible: true },
    ]);
    remainingTimes.current[id] = duration;
    startTimes.current[id] = Date.now();
    timers.current[id] = setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      delete timers.current[id];
      delete remainingTimes.current[id];
      delete startTimes.current[id];
    }, 300);
  };

  const handleMouseEnter = () => {
    isHovering.current = true;
    Object.keys(timers.current).forEach((id) => {
      clearTimeout(timers.current[Number(id)]);
      remainingTimes.current[Number(id)] -=
        Date.now() - startTimes.current[Number(id)];
    });
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    Object.keys(remainingTimes.current).forEach((id) => {
      if (remainingTimes.current[Number(id)] > 0) {
        startTimes.current[Number(id)] = Date.now();
        timers.current[Number(id)] = setTimeout(
          () => removeToast(Number(id)),
          remainingTimes.current[Number(id)]
        );
      }
    });
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* {createPortal(
        <div
          className={styles["toast-container"]}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`${styles.toast} ${styles[`toast-${toast.type}`]} ${
                toast.isVisible ? styles["toast-enter"] : styles["toast-exit"]
              }`}
              onClick={() => removeToast(toast.id)}
            >
              {toast.message}
            </div>
          ))}
        </div>,
        document.body
      )} */}
      <ClientOnly>
        <ReactPortal wrapperId="toast-wrapper">
          <div
            className={styles["toast-container"]}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`${styles.toast} ${styles[`toast-${toast.type}`]} ${
                  toast.isVisible ? styles["toast-enter"] : styles["toast-exit"]
                }`}
                onClick={() => removeToast(toast.id)}
              >
                {toast.message}
              </div>
            ))}
          </div>
        </ReactPortal>
      </ClientOnly>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
