"use client";

import { useEffect, useState } from "react";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let listeners: ((t: ToastItem) => void)[] = [];

export function showToast(message: string, type: ToastItem["type"] = "info") {
  listeners.forEach((fn) => fn({ id: Date.now().toString(), message, type }));
}

const iconPaths: Record<string, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  error: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
  info: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
};

const iconColors: Record<string, string> = {
  success: "var(--green)",
  error: "var(--red)",
  info: "var(--accent)",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((p) => [...p.slice(-2), t]);
      setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 3000);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter((fn) => fn !== handler); };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none" style={{ maxWidth: "90vw" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-toast pointer-events-auto flex items-center gap-2.5 px-5 py-3 rounded-2xl"
          style={{
            background: "var(--bg-1)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke={iconColors[t.type]} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[t.type]} />
          </svg>
          <span style={{ color: "var(--text-0)", fontSize: 15, fontWeight: 500 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
