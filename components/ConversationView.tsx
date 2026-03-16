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
    return new Date(ts).toLocaleString("es-MX", { hour: "2-digit", minute: "2-digit" });
  } catch { return ts; }
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
  avatarColor,
  onBack,
}: {
  messages: Message[];
  contactName: string;
  contactPhone: string;
  avatarColor: string;
  onBack: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-0)" }}>
      {/* Header */}
      <header className="header-blur" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} className="btn btn-ghost" style={{ width: 40, height: 40, borderRadius: "50%" }}>
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--text-0)" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: avatarColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 19, fontWeight: 700, color: "#fff",
          }}>
            {contactName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "var(--text-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {contactName}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-3)", fontFamily: "'SF Mono', monospace" }}>
              {formatPhone(contactPhone)}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="scroll-thin"
        style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {messages.length === 0 && (
            <div className="anim-enter" style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
                background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 700, color: "#fff",
              }}>
                {contactName.charAt(0).toUpperCase()}
              </div>
              <p style={{ fontSize: 18, fontWeight: 600, color: "var(--text-1)" }}>{contactName}</p>
              <p style={{ fontSize: 15, color: "var(--text-3)", marginTop: 4 }}>Sin mensajes en esta conversacion</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const prev = i > 0 ? messages[i - 1] : null;
              const showDate = !prev || new Date(msg.timestamp).toDateString() !== new Date(prev.timestamp).toDateString();

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                      <span style={{
                        fontSize: 13, fontWeight: 600, color: "var(--text-3)",
                        background: "var(--bg-2)", padding: "5px 16px", borderRadius: 20,
                      }}>
                        {new Date(msg.timestamp).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
                      </span>
                    </div>
                  )}

                  <div style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 8,
                    marginBottom: 2,
                  }}>
                    {/* Bot avatar */}
                    {!isUser && (
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: "#fff",
                      }}>
                        C
                      </div>
                    )}

                    <div
                      className={isUser ? "bubble-in" : "bubble-out"}
                      style={{
                        maxWidth: "75%",
                        padding: "14px 18px",
                      }}
                    >
                      <div style={{
                        fontSize: 18,
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}>
                        {msg.displayText || msg.content}
                      </div>
                      <div style={{ fontSize: 12, marginTop: 8, textAlign: "right", opacity: 0.5 }}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>

                    {/* User avatar */}
                    {isUser && (
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: avatarColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: "#fff",
                      }}>
                        {contactName.charAt(0).toUpperCase()}
                      </div>
                    )}
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
