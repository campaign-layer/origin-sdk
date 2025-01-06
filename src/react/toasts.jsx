import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./toasts.module.css";

const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});
  const remainingTimes = useRef({});
  const startTimes = useRef({});
  const isHovering = useRef(false);

  const addToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, isVisible: true },
    ]);
    remainingTimes.current[id] = duration;
    startTimes.current[id] = Date.now();
    timers.current[id] = setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === Number(id) ? { ...toast, isVisible: false } : toast
      )
    );
    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => toast.id !== Number(id))
      );
      delete timers.current[id];
      delete remainingTimes.current[id];
      delete startTimes.current[id];
    }, 300);
  };

  const handleMouseEnter = () => {
    isHovering.current = true;
    Object.keys(timers.current).forEach((id) => {
      clearTimeout(timers.current[id]);
      remainingTimes.current[id] -= Date.now() - startTimes.current[id];
    });
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    Object.keys(remainingTimes.current).forEach((id) => {
      if (remainingTimes.current[id] > 0) {
        startTimes.current[id] = Date.now();
        timers.current[id] = setTimeout(
          () => removeToast(id),
          remainingTimes.current[id]
        );
      }
    });
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {createPortal(
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
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
