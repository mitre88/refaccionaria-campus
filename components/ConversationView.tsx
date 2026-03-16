"use client";

import { useEffect, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { BlurFade } from "./magicui/blur-fade";

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
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg-0)" }}>
      {/* Header */}
      <header className="header-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-[800px] items-center gap-3 px-4 py-2.5">
          <button onClick={onBack} className="btn btn-ghost flex h-10 w-10 items-center justify-center rounded-full">
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--text-0)" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[19px] font-bold text-white"
            style={{ background: avatarColor }}
          >
            {contactName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-bold" style={{ color: "var(--text-0)" }}>
              {contactName}
            </p>
            <p className="font-mono text-[13px]" style={{ color: "var(--text-3)" }}>
              {formatPhone(contactPhone)}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="scroll-thin flex-1 overflow-y-auto px-4 py-5"
      >
        <div className="mx-auto max-w-[800px]">
          {messages.length === 0 && (
            <BlurFade delay={0.1}>
              <div className="py-20 text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold text-white"
                  style={{ background: avatarColor }}
                >
                  {contactName.charAt(0).toUpperCase()}
                </div>
                <p className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>{contactName}</p>
                <p className="mt-1 text-[15px]" style={{ color: "var(--text-3)" }}>Sin mensajes en esta conversacion</p>
              </div>
            </BlurFade>
          )}

          <div className="flex flex-col gap-1.5">
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const prev = i > 0 ? messages[i - 1] : null;
              const showDate = !prev || new Date(msg.timestamp).toDateString() !== new Date(prev.timestamp).toDateString();

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="py-4 text-center">
                      <span
                        className="rounded-full px-4 py-1.5 text-[13px] font-semibold"
                        style={{ color: "var(--text-3)", background: "var(--bg-2)" }}
                      >
                        {new Date(msg.timestamp).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
                      </span>
                    </div>
                  )}

                  <div
                    className="flex items-end gap-2"
                    style={{
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      marginBottom: 2,
                    }}
                  >
                    {/* Bot avatar */}
                    {!isUser && (
                      <img
                        src="/campitos-avatar.png"
                        alt="Campitos"
                        className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                      />
                    )}

                    <div
                      className={isUser ? "bubble-in" : "bubble-out"}
                      style={{ maxWidth: "75%", padding: "14px 18px" }}
                    >
                      <div className="whitespace-pre-wrap break-words text-[18px] leading-relaxed">
                        {msg.displayText || msg.content}
                      </div>
                      <div className="mt-2 text-right text-[12px] opacity-50">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>

                    {/* User avatar */}
                    {isUser && (
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ background: avatarColor }}
                      >
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
