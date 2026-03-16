"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { showToast } from "./Toast";

interface Message {
  id: string;
  timestamp: string;
  role: "user" | "assistant";
  content: string;
  displayText?: string;
  sender?: string;
  phone?: string;
  model?: string;
  provider?: string;
}

function formatTime(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleString("es-MX", {
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
    return phone.replace("+521", "+52 1 ").replace(/(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");
  }
  return phone;
}

export function ConversationView({
  botId,
  botName,
  onBack,
}: {
  botId: string;
  botName: string;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [contacts, setContacts] = useState<{ phone: string; name: string; count: number }[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async (phone?: string) => {
    setLoading(true);
    setError("");
    try {
      const qs = phone ? `?phone=${encodeURIComponent(phone)}&limit=500` : "?limit=500";
      const res = await fetch(`/api/bots/${botId}/messages${qs}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        showToast(`${data.messages.length} mensajes cargados`, "success");

        if (!phone) {
          const contactMap = new Map<string, { name: string; count: number }>();
          for (const m of data.messages) {
            if (m.role === "user" && m.phone) {
              const existing = contactMap.get(m.phone);
              if (existing) {
                existing.count++;
                if (m.sender) existing.name = m.sender;
              } else {
                contactMap.set(m.phone, { name: m.sender || m.phone, count: 1 });
              }
            }
          }
          setContacts(
            Array.from(contactMap.entries())
              .map(([phone, data]) => ({ phone, ...data }))
              .sort((a, b) => b.count - a.count)
          );
        }
      }
    } catch {
      setError("Error cargando mensajes");
      showToast("Error al cargar mensajes", "error");
    } finally {
      setLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleFilterByPhone(phone: string) {
    setFilterPhone(phone);
    setShowContacts(false);
    showToast(`Filtrando por ${formatPhone(phone)}`, "info");
    fetchMessages(phone);
  }

  function clearFilter() {
    setFilterPhone("");
    fetchMessages();
  }

  const filteredContacts = contacts.filter(c =>
    !searchQuery ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500"
        style={{ background: "color-mix(in srgb, var(--bg-base) 80%, transparent)", borderColor: "var(--border)" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl btn-press focus-ring transition-all duration-200"
            style={{ background: "var(--bg-surface-hover)" }}
          >
            <svg className="w-[18px] h-[18px]" style={{ color: "var(--text-primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {botName}
              </h1>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#22c55e", animation: "pulse-glow 2s ease-in-out infinite" }}
              />
            </div>
            <p className="text-[12px] truncate" style={{ color: "var(--text-tertiary)" }}>
              {filterPhone
                ? `Filtrando: ${formatPhone(filterPhone)}`
                : `${messages.length} mensajes · ${contacts.length} contactos`}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {filterPhone && (
              <button
                onClick={clearFilter}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg btn-press transition-all"
                style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
              >
                Limpiar
              </button>
            )}
            <button
              onClick={() => setShowContacts(!showContacts)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl btn-press focus-ring"
              style={{ background: "var(--bg-surface-hover)" }}
            >
              <svg className="w-[18px] h-[18px]" style={{ color: "var(--text-secondary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {contacts.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-[18px] h-[18px] text-[9px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: "var(--accent)", color: "#000" }}
                >
                  {contacts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => fetchMessages(filterPhone || undefined)}
              className="w-9 h-9 flex items-center justify-center rounded-xl btn-press focus-ring"
              style={{ background: "var(--bg-surface-hover)" }}
            >
              <svg className="w-[18px] h-[18px]" style={{ color: "var(--text-secondary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Contacts Sidebar */}
      {showContacts && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: "var(--overlay)" }}
            onClick={() => setShowContacts(false)}
          />
          <div
            className="relative ml-auto w-80 max-w-[85vw] h-full overflow-hidden flex flex-col animate-slide-in-right"
            style={{ background: "var(--bg-surface)", borderLeft: "1px solid var(--border)" }}
          >
            {/* Contacts Header */}
            <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Contactos</h3>
                <button
                  onClick={() => setShowContacts(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg btn-press"
                  style={{ background: "var(--bg-surface-hover)" }}
                >
                  <svg className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar contacto..."
                className="w-full rounded-lg px-3 py-2 text-[13px] focus:outline-none focus-ring"
                style={{
                  background: "var(--bg-surface-hover)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
              <p className="text-[11px] mt-2" style={{ color: "var(--text-tertiary)" }}>
                {filteredContacts.length} contactos
              </p>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="stagger-children">
                {filteredContacts.map((c) => (
                  <button
                    key={c.phone}
                    onClick={() => handleFilterByPhone(c.phone)}
                    className="w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all duration-200"
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      background: filterPhone === c.phone ? "var(--accent-soft)" : "transparent",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[14px] font-semibold"
                      style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {c.name}
                      </p>
                      <p className="text-[12px] font-mono" style={{ color: "var(--text-tertiary)" }}>
                        {formatPhone(c.phone)}
                      </p>
                    </div>
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--bg-surface-hover)", color: "var(--text-secondary)" }}
                    >
                      {c.count}
                    </span>
                  </button>
                ))}
                {filteredContacts.length === 0 && (
                  <p className="text-center py-10 text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                    Sin contactos
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-5 max-w-4xl mx-auto w-full"
      >
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in gap-3">
            <div
              className="w-8 h-8 border-[2.5px] rounded-full animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
            />
            <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>Cargando conversaciones...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 animate-fade-in">
            <svg className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>{error}</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--bg-surface-hover)" }}
            >
              <svg className="w-8 h-8" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>Sin mensajes</p>
            <p className="text-[13px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Las conversaciones apareceran aqui
            </p>
          </div>
        )}

        <div className="space-y-4 stagger-children">
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-[11px] font-bold"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  C
                </div>
              )}
              <div className={msg.role === "user" ? "msg-user" : "msg-bot"}>
                {msg.role === "user" && msg.sender && (
                  <div className="text-[11px] mb-1.5 font-medium opacity-70">
                    {msg.sender}
                    {msg.phone && (
                      <span className="font-mono opacity-60 ml-1">
                        {formatPhone(msg.phone)}
                      </span>
                    )}
                  </div>
                )}
                {msg.role === "assistant" && (
                  <div className="text-[11px] mb-1.5 font-medium opacity-60">
                    {botName}
                    {msg.model && <span className="opacity-50 ml-1">({msg.model})</span>}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.displayText || msg.content}</div>
                <div className="text-[10px] mt-2 text-right opacity-40">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
