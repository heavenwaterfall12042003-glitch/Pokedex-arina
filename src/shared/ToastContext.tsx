import { createContext } from "react";

export type ToastKind = "info" | "success" | "error";
export type ToastItem = { id: number; text: string; kind?: ToastKind };
export type ToastCtx = { show: (text: string, kind?: ToastKind) => void };

export const ToastContext = createContext<ToastCtx | null>(null);
