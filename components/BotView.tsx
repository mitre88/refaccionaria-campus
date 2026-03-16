"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationView } from "./ConversationView";
import { ThemeToggle } from "./ThemeToggle";
import { showToast } from "./Toast";
import { MagicCard } from "./magicui/magic-card";
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
    <div className="min-h-screen" style={{ background: "var(--bg-0)" }}>
      {/* Header */}
      <header className="header-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-[700px] items-center gap-3 px-5 py-2.5">
          <button onClick={onBack} className="btn btn-ghost flex h-10 w-10 items-center justify-center rounded-full">
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--text-0)" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src="/campitos-avatar.png"
            alt="Campitos"
            className="h-11 w-11 rounded-[14px] object-cover"
          />
          <div className="flex-1">
            <span className="text-lg font-bold" style={{ color: "var(--text-0)" }}>{botName}</span>
            <p className="text-[13px]" style={{ color: "var(--text-3)" }}>{contacts.length} conversaciones</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-[700px] px-5 pb-10 pt-4">
        {/* Search */}
        <BlurFade delay={0}>
          <div className="relative mb-4">
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="input" placeholder="Buscar contacto o numero..."
              style={{ paddingLeft: 44, borderRadius: "var(--radius-full)", background: "var(--bg-1)", border: "1px solid var(--border-subtle)" }}
            />
          </div>
        </BlurFade>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="skeleton h-14 w-14 flex-shrink-0 rounded-full" />
                <div className="flex-1">
                  <div className="skeleton mb-2 h-4 w-[40%]" />
                  <div className="skeleton h-3.5 w-[65%]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts */}
        {!loading && (
          <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]" style={{ background: "var(--bg-1)" }}>
            {filtered.length === 0 && (
              <div className="px-5 py-16 text-center">
                <svg width={48} height={48} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1} className="mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-[17px] font-semibold" style={{ color: "var(--text-1)" }}>
                  {search ? "Sin resultados" : "Sin conversaciones"}
                </p>
              </div>
            )}

            {filtered.map((c, i) => (
              <BlurFade key={c.phone} delay={0.02 * i}>
                <button
                  onClick={() => setSelectedPhone(c.phone)}
                  className="group flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-[var(--bg-hover)]"
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-[22px] font-bold text-white"
                    style={{
                      background: getAvatarColor(c.phone),
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="truncate text-[17px] font-semibold" style={{ color: "var(--text-0)" }}>
                        {c.name}
                      </span>
                      <span className="ml-2 flex-shrink-0 text-[13px]" style={{ color: "var(--text-3)" }}>
                        {timeAgo(c.lastTimestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[15px]" style={{ color: "var(--text-2)" }}>
                        {c.lastMessage || formatPhone(c.phone)}
                      </span>
                      <span
                        className="ml-2 min-w-[22px] flex-shrink-0 rounded-full px-2 py-0.5 text-center text-[12px] font-bold text-white"
                        style={{ background: "var(--accent)" }}
                      >
                        {c.count}
                      </span>
                    </div>
                    <span className="mt-0.5 block text-[13px] font-mono" style={{ color: "var(--text-3)" }}>
                      {formatPhone(c.phone)}
                    </span>
                  </div>

                  {/* Arrow */}
                  <svg
                    width={16} height={16} fill="none" viewBox="0 0 24 24"
                    stroke="var(--text-3)" strokeWidth={2}
                    className="flex-shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </BlurFade>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
