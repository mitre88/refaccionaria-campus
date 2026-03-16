"use client";

import { useState, useEffect, useCallback } from "react";
import { BotView } from "./BotView";
import { ThemeToggle } from "./ThemeToggle";
import { showToast } from "./Toast";
import { MagicCard } from "./magicui/magic-card";
import { BlurFade } from "./magicui/blur-fade";
import { NumberTicker } from "./magicui/number-ticker";
import { BorderBeam } from "./magicui/border-beam";
import { Ripple } from "./magicui/ripple";

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
    <div className="min-h-screen" style={{ background: "var(--bg-0)" }}>
      {/* Top Bar */}
      <header className="header-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-hover))" }}
            >
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: "var(--text-0)" }}>
              Refaccionaria Campos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div
              className="flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5"
              style={{ background: "var(--bg-2)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{user}</span>
              <button
                onClick={() => { showToast("Sesion cerrada", "info"); setTimeout(onLogout, 400); }}
                className="btn btn-ghost flex h-8 w-8 items-center justify-center rounded-full"
              >
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="var(--text-2)" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-5 pb-10 pt-6">
        {/* Welcome */}
        <BlurFade delay={0}>
          <h2 className="mb-1 text-3xl font-bold tracking-tight" style={{ color: "var(--text-0)" }}>
            Panel de control
          </h2>
          <p className="mb-8 text-base" style={{ color: "var(--text-2)" }}>
            Gestiona tu bot y revisa las conversaciones con tus clientes
          </p>
        </BlurFade>

        {/* Stats Row with Magic Cards */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Bots activos", value: bots.filter(b => b.status === "active").length, icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "var(--green)", delay: 0.05 },
            { label: "Canal", value: -1, text: "WhatsApp", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "#25d366", delay: 0.1 },
            { label: "Ultima actividad", value: -1, text: bots[0] ? timeAgo(bots[0].lastActivity) : "---", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "var(--accent)", delay: 0.15 },
          ].map((s) => (
            <BlurFade key={s.label} delay={s.delay}>
              <MagicCard
                className="rounded-xl border border-[var(--border-subtle)]"
                gradientColor="var(--accent-soft)"
                gradientOpacity={0.5}
                gradientFrom="var(--accent)"
                gradientTo="transparent"
              >
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke={s.color} strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
                      {s.label}
                    </span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: "var(--text-0)" }}>
                    {s.value >= 0
                      ? <NumberTicker value={s.value} delay={0.3} />
                      : s.text
                    }
                  </span>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        {/* Bot Section */}
        <BlurFade delay={0.2}>
          <h3 className="mb-4 text-lg font-bold" style={{ color: "var(--text-0)" }}>Bots</h3>
        </BlurFade>

        {loading ? (
          <div className="fb-card flex items-center gap-4 p-6">
            <div className="skeleton h-16 w-16 flex-shrink-0 rounded-2xl" />
            <div className="flex-1">
              <div className="skeleton mb-3 h-5 w-[35%]" />
              <div className="skeleton h-4 w-[60%]" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bots.map((bot, i) => {
              const online = bot.status === "active";
              return (
                <BlurFade key={bot.id} delay={0.25 + i * 0.05}>
                  <button
                    onClick={() => setSelectedBotId(bot.id)}
                    className="group relative w-full cursor-pointer overflow-hidden text-left"
                  >
                    <MagicCard
                      className="rounded-xl border border-[var(--border-subtle)]"
                      gradientColor="var(--accent-soft)"
                      gradientOpacity={0.6}
                      gradientFrom="#c27115"
                      gradientTo="#e89830"
                    >
                      <div className="flex items-center gap-5 p-6">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div
                            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-extrabold text-white"
                            style={{
                              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                              boxShadow: "0 4px 16px rgba(194, 113, 21, 0.3)",
                            }}
                          >
                            C
                          </div>
                          {online && (
                            <div
                              className="live-dot absolute -bottom-0.5 -right-0.5"
                              style={{ border: "3px solid var(--bg-1)", width: 16, height: 16 }}
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-xl font-bold" style={{ color: "var(--text-0)" }}>{bot.name}</span>
                            {online && (
                              <span
                                className="rounded-full px-3 py-0.5 text-xs font-semibold"
                                style={{ color: "var(--green)", background: "var(--green-soft)" }}
                              >
                                En linea
                              </span>
                            )}
                          </div>
                          <p className="mb-0.5 text-[15px]" style={{ color: "var(--text-2)" }}>{bot.description}</p>
                          <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                            WhatsApp · Kimi K2.5 · {timeAgo(bot.lastActivity)}
                          </p>
                        </div>

                        {/* Arrow */}
                        <svg
                          width={20} height={20} fill="none" viewBox="0 0 24 24"
                          stroke="var(--text-3)" strokeWidth={2}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>

                      {/* Border beam on the active bot */}
                      {online && <BorderBeam size={250} duration={8} colorFrom="var(--accent)" colorTo="var(--accent-glow)" />}
                    </MagicCard>
                  </button>
                </BlurFade>
              );
            })}
          </div>
        )}

        {/* Future Features */}
        <BlurFade delay={0.35}>
          <h3 className="mb-4 mt-10 text-lg font-bold" style={{ color: "var(--text-0)" }}>
            Proximamente
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { title: "Estadisticas", desc: "Metricas de conversacion y rendimiento", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
              { title: "Catalogo", desc: "Gestion de productos y precios", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
              { title: "Reportes", desc: "Exportar datos y generar reportes", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
            ].map((item, i) => (
              <BlurFade key={item.title} delay={0.4 + i * 0.05}>
                <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] p-5 opacity-50" style={{ background: "var(--bg-1)" }}>
                  <Ripple color="var(--accent)" count={3} />
                  <svg width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.5} className="relative z-10 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <p className="relative z-10 mb-1 text-[15px] font-bold" style={{ color: "var(--text-1)" }}>{item.title}</p>
                  <p className="relative z-10 text-[13px]" style={{ color: "var(--text-3)" }}>{item.desc}</p>
                  <span
                    className="relative z-10 mt-3 inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
                    style={{ color: "var(--text-3)", background: "var(--bg-2)" }}
                  >
                    Proximamente
                  </span>
                </div>
              </BlurFade>
            ))}
          </div>
        </BlurFade>
      </main>
    </div>
  );
}
