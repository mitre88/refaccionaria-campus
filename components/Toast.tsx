"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  exiting?: boolean;
}

let listeners: ((t: ToastItem) => void)[] = [];

export function showToast(message: string, type: ToastItem["type"] = "info") {
  listeners.forEach((fn) => fn({ id: Date.now().toString(), message, type }));
}

const icons: Record<string, ReactNode> = {
  success: (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  error: (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  ),
  info: (
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  ),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((p) => [...p.slice(-2), t]);
      setTimeout(() => {
        setToasts((p) => p.map((x) => x.id === t.id ? { ...x, exiting: true } : x));
        setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 300);
      }, 3000);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter((fn) => fn !== handler); };
  }, []);

  if (!toasts.length) return null;

  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px 12px 12px",
            background: "var(--notif-bg)",
            border: "1px solid var(--notif-border)",
            borderRadius: 12,
            boxShadow: "var(--shadow-lg)",
            animation: t.exiting ? "notif-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) both" : "notif-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {icons[t.type]}
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-0)" }}>{t.message}</span>
          </div>
          {/* Progress bar */}
          {!t.exiting && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, height: 3,
              background: t.type === "success" ? "var(--green)" : t.type === "error" ? "var(--red)" : "var(--accent)",
              animation: "progress 3s linear both",
              borderRadius: "0 0 12px 12px",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
