"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
    fetchMessages(phone);
  }

  function clearFilter() {
    setFilterPhone("");
    fetchMessages();
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold">{botName}</h1>
            <p className="text-xs text-gray-500">
              {filterPhone
                ? `Filtrando: ${formatPhone(filterPhone)}`
                : `${messages.length} mensajes | ${contacts.length} contactos`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {filterPhone && (
              <button
                onClick={clearFilter}
                className="text-xs text-amber-500 hover:text-amber-400 px-2 py-1 rounded hover:bg-white/5 transition"
              >
                Limpiar filtro
              </button>
            )}
            <button
              onClick={() => setShowContacts(!showContacts)}
              className="relative text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {contacts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {contacts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => fetchMessages(filterPhone || undefined)}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Contacts Sidebar */}
      {showContacts && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowContacts(false)} />
          <div className="relative ml-auto w-80 max-w-[85vw] bg-[#111118] border-l border-white/5 h-full overflow-y-auto scrollbar-thin">
            <div className="p-4 border-b border-white/5">
              <h3 className="font-semibold text-sm">Contactos</h3>
              <p className="text-xs text-gray-500">{contacts.length} contactos encontrados</p>
            </div>
            <div className="divide-y divide-white/5">
              {contacts.map((c) => (
                <button
                  key={c.phone}
                  onClick={() => handleFilterByPhone(c.phone)}
                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition ${filterPhone === c.phone ? "bg-amber-500/10 border-l-2 border-amber-500" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{formatPhone(c.phone)}</p>
                    </div>
                    <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                      {c.count} msgs
                    </span>
                  </div>
                </button>
              ))}
              {contacts.length === 0 && (
                <p className="text-center text-gray-600 text-xs py-8">Sin contactos</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 max-w-4xl mx-auto w-full"
      >
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm">No hay mensajes disponibles</p>
            <p className="text-gray-700 text-xs mt-1">Las conversaciones apareceran aqui conforme el bot interactue</p>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`message-bubble ${msg.role === "user" ? "user" : "bot"}`}>
                {msg.role === "user" && msg.sender && (
                  <div className="text-[10px] text-blue-400/70 mb-1 font-medium">
                    {msg.sender} {msg.phone && <span className="text-gray-600 font-mono">({formatPhone(msg.phone)})</span>}
                  </div>
                )}
                {msg.role === "assistant" && (
                  <div className="text-[10px] text-green-500/70 mb-1 font-medium">
                    {botName} {msg.model && <span className="text-gray-600">({msg.model})</span>}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.displayText || msg.content}</div>
                <div className="text-[10px] text-gray-600 mt-1 text-right">
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
