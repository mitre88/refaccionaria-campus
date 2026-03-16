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

const typeConfig: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  success: {
    bg: "linear-gradient(135deg, rgba(66,183,42,0.12), rgba(66,183,42,0.04))",
    border: "rgba(66,183,42,0.3)",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    glow: "0 0 20px rgba(66,183,42,0.15)",
  },
  error: {
    bg: "linear-gradient(135deg, rgba(250,62,62,0.12), rgba(250,62,62,0.04))",
    border: "rgba(250,62,62,0.3)",
    icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
    glow: "0 0 20px rgba(250,62,62,0.15)",
  },
  info: {
    bg: "linear-gradient(135deg, rgba(24,119,242,0.12), rgba(24,119,242,0.04))",
    border: "rgba(24,119,242,0.3)",
    icon: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
    glow: "0 0 20px rgba(24,119,242,0.15)",
  },
};

const colorMap: Record<string, string> = {
  success: "var(--green)",
  error: "var(--red)",
  info: "var(--primary)",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((p) => [...p.slice(-2), t]);
      setTimeout(() => {
        setToasts((p) => p.map((x) => x.id === t.id ? { ...x, exiting: true } : x));
        setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 400);
      }, 3500);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter((fn) => fn !== handler); };
  }, []);

  if (!toasts.length) return null;

  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 10, maxWidth: 400,
    }}>
      {toasts.map((t) => {
        const cfg = typeConfig[t.type];
        const color = colorMap[t.type];
        return (
          <div
            key={t.id}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "16px 20px",
              background: cfg.bg,
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: `1px solid ${cfg.border}`,
              borderRadius: 16,
              boxShadow: `var(--shadow-lg), ${cfg.glow}`,
              animation: t.exiting
                ? "toast-exit 0.4s cubic-bezier(0.16, 1, 0.3, 1) both"
                : "toast-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Icon */}
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: color,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${cfg.border}`,
            }}>
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={cfg.icon} />
              </svg>
            </div>

            {/* Message */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                fontSize: 15, fontWeight: 600,
                color: "var(--text-0)",
                lineHeight: 1.3,
              }}>
                {t.message}
              </span>
            </div>

            {/* Close */}
            <button
              onClick={() => {
                setToasts((p) => p.map((x) => x.id === t.id ? { ...x, exiting: true } : x));
                setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 400);
              }}
              style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-3)", transition: "all 0.2s",
              }}
            >
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Progress bar */}
            {!t.exiting && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, height: 3,
                background: `linear-gradient(90deg, ${color}, transparent)`,
                animation: "toast-progress 3.5s linear both",
                borderRadius: "0 0 16px 16px",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
