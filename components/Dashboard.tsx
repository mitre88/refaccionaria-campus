"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationView } from "./ConversationView";
import { ThemeToggle } from "./ThemeToggle";
import { showToast } from "./Toast";

interface Contact {
  phone: string;
  name: string;
  count: number;
  lastMessage: string;
  lastTimestamp: string;
}

interface Message {
  id: string;
  timestamp: string;
  role: "user" | "assistant";
  displayText?: string;
  content: string;
  sender?: string;
  phone?: string;
  model?: string;
}

function timeAgo(ts: string): string {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function formatPhone(phone: string): string {
  if (phone.startsWith("+521")) {
    const digits = phone.slice(4);
    return `+52 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (phone.startsWith("+52")) {
    const digits = phone.slice(3);
    return `+52 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

export function Dashboard({ user, onLogout }: { user: string; onLogout: () => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [botOnline, setBotOnline] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [msgsRes, statusRes] = await Promise.all([
        fetch("/api/bots/campos/messages?limit=500"),
        fetch("/api/bots/campos/status"),
      ]);
      const [msgsData, statusData] = await Promise.all([msgsRes.json(), statusRes.json()]);

      if (msgsData.messages) {
        setAllMessages(msgsData.messages);

        const contactMap = new Map<string, Contact>();
        for (const m of msgsData.messages as Message[]) {
          if (m.role === "user" && m.phone) {
            const existing = contactMap.get(m.phone);
            const text = m.displayText || m.content || "";
            if (existing) {
              existing.count++;
              if (m.sender) existing.name = m.sender;
              existing.lastMessage = text.slice(0, 60);
              existing.lastTimestamp = m.timestamp;
            } else {
              contactMap.set(m.phone, {
                phone: m.phone,
                name: m.sender || m.phone,
                count: 1,
                lastMessage: text.slice(0, 60),
                lastTimestamp: m.timestamp,
              });
            }
          }
        }
        setContacts(
          Array.from(contactMap.values()).sort(
            (a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()
          )
        );
      }

      setBotOnline(statusData.status === "active" || statusData.botId === "campos");
    } catch {
      showToast("Error conectando con el servidor", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 25000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (selectedPhone) {
    const contact = contacts.find((c) => c.phone === selectedPhone);
    const threadMsgs: Message[] = [];
    let include = false;
    for (const m of allMessages) {
      if (m.role === "user" && m.phone === selectedPhone) {
        threadMsgs.push(m);
        include = true;
      } else if (m.role === "assistant" && include) {
        threadMsgs.push(m);
        include = false;
      } else {
        include = false;
      }
    }
    return (
      <ConversationView
        messages={threadMsgs}
        contactName={contact?.name || selectedPhone}
        contactPhone={selectedPhone}
        onBack={() => setSelectedPhone(null)}
      />
    );
  }

  const filtered = contacts.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-0)" }}>
      {/* Header */}
      <header className="header-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Bot Avatar */}
            <div
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--accent-soft)" }}
            >
              <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>C</span>
              {botOnline && (
                <div className="live-dot absolute -bottom-0.5 -right-0.5" style={{ width: 10, height: 10, border: "2px solid var(--bg-0)" }} />
              )}
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-0)" }}>
                Campitos
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>
                {botOnline ? "En linea" : "Desconectado"} · {contacts.length} conversaciones
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { fetchData(); showToast("Actualizado", "success"); }}
              className="btn btn-ghost"
              style={{ width: 36, height: 36 }}
            >
              <svg width={17} height={17} fill="none" viewBox="0 0 24 24" stroke="var(--text-2)" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <ThemeToggle />
            <button
              onClick={() => { showToast("Sesion cerrada", "info"); setTimeout(onLogout, 400); }}
              className="btn btn-surface"
              style={{ height: 36, padding: "0 14px", fontSize: 13, fontWeight: 600 }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-5 pb-10">
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <div className="relative">
            <svg
              width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.8}
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 42, fontSize: 15 }}
              placeholder="Buscar conversacion..."
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card" style={{ padding: 20, display: "flex", gap: 14, alignItems: "center" }}>
                <div className="skeleton" style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact List */}
        {!loading && (
          <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filtered.length === 0 && (
              <div className="anim-enter" style={{ textAlign: "center", padding: "60px 0" }}>
                <svg width={48} height={48} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1} style={{ margin: "0 auto 16px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p style={{ fontSize: 17, fontWeight: 600, color: "var(--text-1)" }}>Sin conversaciones</p>
                <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
                  {search ? "No se encontraron resultados" : "Apareceran aqui cuando el bot interactue"}
                </p>
              </div>
            )}

            {filtered.map((c) => (
              <button
                key={c.phone}
                onClick={() => setSelectedPhone(c.phone)}
                className="card"
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "var(--accent-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--accent)",
                  }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-3)", flexShrink: 0, marginLeft: 8 }}>
                      {timeAgo(c.lastTimestamp)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.lastMessage || formatPhone(c.phone)}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        background: "var(--accent)",
                        borderRadius: 20,
                        padding: "2px 8px",
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {c.count}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "monospace" }}>
                    {formatPhone(c.phone)}
                  </span>
                </div>

                {/* Chevron */}
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={2} style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
