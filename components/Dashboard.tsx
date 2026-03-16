"use client";

import { useState, useEffect, useCallback } from "react";
import { BotView } from "./BotView";
import { ThemeToggle } from "./ThemeToggle";
import { showToast } from "./Toast";

interface Bot {
  id: string;
  name: string;
  description: string;
  status: string;
  channel: string;
  model: string;
  sessionsCount: number;
  lastActivity: string | null;
  lastContact: string | null;
}

function timeAgo(ts: string | null): string {
  if (!ts) return "---";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

export function Dashboard({ user, onLogout }: { user: string; onLogout: () => void }) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBots = useCallback(async () => {
    try {
      const res = await fetch("/api/bots");
      const data = await res.json();
      if (data.bots) {
        setBots(data.bots.filter((b: Bot) => b.id === "campos"));
      }
    } catch {
      showToast("Error conectando con el servidor", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBots();
    const i = setInterval(fetchBots, 30000);
    return () => clearInterval(i);
  }, [fetchBots]);

  if (selectedBotId) {
    const bot = bots.find((b) => b.id === selectedBotId);
    return (
      <BotView
        botId={selectedBotId}
        botName={bot?.name || "Bot"}
        onBack={() => setSelectedBotId(null)}
        user={user}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)" }}>
      {/* Top Bar */}
      <header className="header-blur" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-0)", letterSpacing: "-0.01em" }}>
              Refaccionaria Campos
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 6px 6px 14px", borderRadius: "var(--radius-full)",
              background: "var(--bg-2)",
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{user}</span>
              <button
                onClick={() => { showToast("Sesion cerrada", "info"); setTimeout(onLogout, 400); }}
                className="btn btn-ghost"
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              >
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="var(--text-2)" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px 40px" }}>
        {/* Welcome section */}
        <div className="anim-enter" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-0)", marginBottom: 4 }}>
            Panel de control
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-2)" }}>
            Gestiona los bots y revisa las conversaciones con tus clientes
          </p>
        </div>

        {/* Stats Row */}
        <div className="anim-enter" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Bots activos", value: bots.filter(b => b.status === "active").length.toString(), icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "var(--green)" },
            { label: "Canal", value: "WhatsApp", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "var(--green)" },
            { label: "Ultima actividad", value: bots[0] ? timeAgo(bots[0].lastActivity) : "---", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "var(--accent)" },
          ].map((s) => (
            <div key={s.label} className="fb-card" style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke={s.color} strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-0)" }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Bots Section */}
        <div className="anim-enter" style={{ animationDelay: "100ms" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-0)", marginBottom: 14 }}>
            Bots
          </h3>

          {loading ? (
            <div className="fb-card" style={{ padding: 24, display: "flex", gap: 16, alignItems: "center" }}>
              <div className="skeleton" style={{ width: 64, height: 64, borderRadius: 18, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 18, width: "35%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, width: "60%" }} />
              </div>
            </div>
          ) : (
            <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bots.map((bot) => {
                const online = bot.status === "active";
                return (
                  <button
                    key={bot.id}
                    onClick={() => setSelectedBotId(bot.id)}
                    className="fb-card fb-card-hover"
                    style={{ width: "100%", textAlign: "left", padding: "20px 24px", display: "flex", alignItems: "center", gap: 18, cursor: "pointer" }}
                  >
                    {/* Avatar */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{
                        width: 64, height: 64, borderRadius: 18,
                        background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 28, fontWeight: 800, color: "#fff",
                        boxShadow: "0 4px 12px rgba(194, 113, 21, 0.25)",
                      }}>
                        C
                      </div>
                      {online && (
                        <div className="live-dot" style={{
                          position: "absolute", bottom: -2, right: -2,
                          border: "3px solid var(--bg-1)",
                          width: 16, height: 16,
                        }} />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-0)" }}>{bot.name}</span>
                        {online && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--green)", background: "var(--green-soft)", padding: "2px 10px", borderRadius: 20 }}>
                            En linea
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 15, color: "var(--text-2)", marginBottom: 2 }}>{bot.description}</p>
                      <p style={{ fontSize: 13, color: "var(--text-3)" }}>
                        WhatsApp · Kimi K2.5 · {timeAgo(bot.lastActivity)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Placeholder sections for future */}
        <div className="anim-enter" style={{ animationDelay: "200ms", marginTop: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-0)", marginBottom: 14 }}>
            Proximas funcionalidades
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { title: "Estadisticas", desc: "Metricas de conversacion y rendimiento", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
              { title: "Catalogo", desc: "Gestion de productos y precios", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
              { title: "Reportes", desc: "Exportar datos y generar reportes", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
            ].map((item) => (
              <div key={item.title} className="fb-card" style={{ padding: "20px", opacity: 0.5 }}>
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.5} style={{ marginBottom: 10 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>{item.title}</p>
                <p style={{ fontSize: 13, color: "var(--text-3)" }}>{item.desc}</p>
                <span style={{ display: "inline-block", marginTop: 8, fontSize: 11, fontWeight: 600, color: "var(--text-3)", background: "var(--bg-2)", padding: "3px 10px", borderRadius: 20 }}>
                  Proximamente
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
