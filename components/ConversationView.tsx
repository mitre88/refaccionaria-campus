"use client";

import { useEffect, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface Message {
  id: string;
  timestamp: string;
  role: "user" | "assistant";
  content: string;
  displayText?: string;
  sender?: string;
  phone?: string;
  model?: string;
}

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

function formatPhone(phone: string): string {
  if (phone.startsWith("+521")) {
    const d = phone.slice(4);
    return `+52 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  return phone;
}

export function ConversationView({
  messages,
  contactName,
  contactPhone,
  onBack,
}: {
  messages: Message[];
  contactName: string;
  contactPhone: string;
  onBack: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-0)" }}>
      {/* Header */}
      <header className="header-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="btn btn-surface"
            style={{ width: 38, height: 38 }}
          >
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--text-0)" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Contact info */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {contactName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {contactName}
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-3)", fontFamily: "monospace" }}>
              {formatPhone(contactPhone)} · {messages.length} msgs
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scroll-thin"
        style={{ padding: "20px 16px" }}
      >
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="anim-enter" style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-1)" }}>Sin mensajes</p>
              <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
                No hay conversaciones con este contacto
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const prevMsg = i > 0 ? messages[i - 1] : null;
              const showDate = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-3)",
                          background: "var(--bg-2)",
                          padding: "4px 14px",
                          borderRadius: 20,
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleDateString("es-MX", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: 8,
                    }}
                  >
                    {/* Bot avatar */}
                    {!isUser && (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "var(--accent-soft)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--accent)",
                        }}
                      >
                        C
                      </div>
                    )}

                    <div
                      className={isUser ? "bubble-in" : "bubble-out"}
                      style={{
                        maxWidth: "78%",
                        padding: "12px 16px",
                        fontSize: 15,
                        lineHeight: 1.55,
                      }}
                    >
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {msg.displayText || msg.content}
                      </div>
                      <div style={{
                        fontSize: 11,
                        marginTop: 6,
                        textAlign: "right",
                        opacity: 0.45,
                      }}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
