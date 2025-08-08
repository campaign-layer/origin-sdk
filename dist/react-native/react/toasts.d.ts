import React, { ReactNode } from "react";
interface ToastContextProps {
    addToast: (message: string, type?: "info" | "success" | "error" | "warning", duration?: number) => void;
}
interface ToastProviderProps {
    children: ReactNode;
}
export declare const ToastProvider: ({ children }: ToastProviderProps) => React.JSX.Element;
export declare const useToast: () => ToastContextProps;
export {};
