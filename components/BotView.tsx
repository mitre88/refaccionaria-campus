"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationView } from "./ConversationView";
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
}

interface Contact {
  phone: string;
  name: string;
  count: number;
  lastMessage: string;
  lastTimestamp: string;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function formatPhone(phone: string): string {
  if (phone.startsWith("+521")) {
    const d = phone.slice(4);
    return `+52 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  if (phone.startsWith("+52")) {
    const d = phone.slice(3);
    return `+52 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  return phone;
}

const AVATAR_COLORS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
  "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  "linear-gradient(135deg, #fccb90, #d57eeb)",
  "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
];

function getAvatarColor(phone: string): string {
  let hash = 0;
  for (let i = 0; i < phone.length; i++) hash = phone.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function BotView({
  botId,
  botName,
  onBack,
  user,
  onLogout,
}: {
  botId: string;
  botName: string;
  onBack: () => void;
  user: string;
  onLogout: () => void;
}) {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/bots/${botId}/messages?limit=500`);
      const data = await res.json();
      if (data.messages) {
        setAllMessages(data.messages);
        const map = new Map<string, Contact>();
        for (const m of data.messages as Message[]) {
          if (m.role === "user" && m.phone) {
            const text = (m.displayText || m.content || "").slice(0, 50);
            const existing = map.get(m.phone);
            if (existing) {
              existing.count++;
              if (m.sender) existing.name = m.sender;
              existing.lastMessage = text;
              existing.lastTimestamp = m.timestamp;
            } else {
              map.set(m.phone, { phone: m.phone, name: m.sender || m.phone, count: 1, lastMessage: text, lastTimestamp: m.timestamp });
            }
          }
        }
        setContacts(Array.from(map.values()).sort((a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()));
        if (!loading) showToast("Conversaciones actualizadas", "success");
      }
    } catch {
      showToast("Error cargando conversaciones", "error");
    } finally {
      setLoading(false);
    }
  }, [botId, loading]);

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 25000);
    return () => clearInterval(i);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

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
        avatarColor={getAvatarColor(selectedPhone)}
        onBack={() => setSelectedPhone(null)}
      />
    );
  }

  const filtered = contacts.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)" }}>
      {/* Header */}
      <header className="header-blur" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} className="btn btn-ghost" style={{ width: 40, height: 40, borderRadius: "50%" }}>
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--text-0)" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Bot avatar */}
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: "#fff",
          }}>
            C
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-0)" }}>{botName}</span>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>{contacts.length} conversaciones</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "16px 20px 40px" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.8}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="input" placeholder="Buscar contacto o numero..."
            style={{ paddingLeft: 44, borderRadius: "var(--radius-full)", background: "var(--bg-1)", border: "1px solid var(--border-subtle)" }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px" }}>
                <div className="skeleton" style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: "65%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts */}
        {!loading && (
          <div className="fb-card scroll-thin" style={{ overflow: "hidden" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <svg width={48} height={48} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1} style={{ margin: "0 auto 14px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p style={{ fontSize: 17, fontWeight: 600, color: "var(--text-1)" }}>
                  {search ? "Sin resultados" : "Sin conversaciones"}
                </p>
              </div>
            )}

            <div className="stagger">
              {filtered.map((c, i) => (
                <button
                  key={c.phone}
                  onClick={() => setSelectedPhone(c.phone)}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "14px 20px",
                    display: "flex", alignItems: "center", gap: 14,
                    cursor: "pointer",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    background: "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                    background: getAvatarColor(c.phone),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, fontWeight: 700, color: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 17, fontWeight: 600, color: "var(--text-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: 13, color: "var(--text-3)", flexShrink: 0, marginLeft: 8 }}>
                        {timeAgo(c.lastTimestamp)}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 15, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.lastMessage || formatPhone(c.phone)}
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: "#fff",
                        background: "var(--accent)", borderRadius: 12,
                        padding: "1px 8px", flexShrink: 0, marginLeft: 8, minWidth: 22, textAlign: "center",
                      }}>
                        {c.count}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, color: "var(--text-3)", fontFamily: "'SF Mono', monospace" }}>
                      {formatPhone(c.phone)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
