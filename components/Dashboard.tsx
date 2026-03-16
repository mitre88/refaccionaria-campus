"use client";

import { useState, useEffect, useCallback } from "react";
import { BotView } from "./BotView";
import { ThemeToggle } from "./ThemeToggle";
import { showToast } from "./Toast";
import { MagicCard } from "./magicui/magic-card";
import { BlurFade } from "./magicui/blur-fade";
import { NumberTicker } from "./magicui/number-ticker";
import { BorderBeam } from "./magicui/border-beam";

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
      if (data.bots) setBots(data.bots.filter((b: Bot) => b.id === "campos"));
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
    return <BotView botId={selectedBotId} botName={bot?.name || "Bot"} onBack={() => setSelectedBotId(null)} user={user} onLogout={onLogout} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-0)" }}>
      {/* ─── Navbar ─── */}
      <header className="header-blur sticky top-0 z-50">
        <div className="mx-auto flex h-[60px] max-w-[1080px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--primary)" }}>
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
              </svg>
            </div>
            <div>
              <span className="text-[17px] font-bold" style={{ color: "var(--text-0)" }}>Refaccionaria Campos</span>
              <span className="ml-2 hidden rounded-full px-2.5 py-0.5 text-[11px] font-bold sm:inline-block" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                CRM
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {[
              { label: "Panel", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", active: true },
              { label: "Bots", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", active: false },
            ].map((nav) => (
              <button
                key={nav.label}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                style={{
                  color: nav.active ? "var(--primary)" : "var(--text-2)",
                  background: nav.active ? "var(--primary-soft)" : "transparent",
                }}
              >
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={nav.icon} />
                </svg>
                {nav.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Notification bell */}
            <button className="btn btn-ghost relative flex h-10 w-10 items-center justify-center rounded-full">
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--text-2)" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <div className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full" style={{ background: "var(--red)", border: "2px solid var(--bg-1)" }} />
            </button>
            {/* User menu */}
            <div className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1" style={{ background: "var(--bg-2)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "var(--primary)" }}>
                {user.charAt(0).toUpperCase()}
              </div>
              <span className="hidden pr-2 text-sm font-semibold sm:block" style={{ color: "var(--text-1)" }}>{user}</span>
              <button
                onClick={() => { showToast("Sesion cerrada", "info"); setTimeout(onLogout, 400); }}
                className="btn btn-ghost flex h-8 w-8 items-center justify-center rounded-full"
                title="Cerrar sesion"
              >
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] px-5 pb-12 pt-8">
        {/* Welcome Hero */}
        <BlurFade delay={0}>
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h2 className="mb-1 text-3xl font-bold tracking-tight" style={{ color: "var(--text-0)" }}>
                Bienvenido, {user}
              </h2>
              <p className="text-[16px]" style={{ color: "var(--text-2)" }}>
                Aqui tienes un resumen de la actividad de tu negocio
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button className="btn flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm" style={{ background: "var(--bg-1)", border: "1px solid var(--border)", color: "var(--text-1)" }}>
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                Actualizar
              </button>
            </div>
          </div>
        </BlurFade>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Bots activos", value: bots.filter(b => b.status === "active").length, icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", iconBg: "var(--primary-soft)", iconColor: "var(--primary)", delay: 0.05 },
            { label: "Canal activo", value: -1, text: "WhatsApp", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", iconBg: "var(--green-soft)", iconColor: "var(--green)", delay: 0.1 },
            { label: "Modelo IA", value: -1, text: "Kimi K2.5", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z", iconBg: "var(--orange-soft)", iconColor: "var(--orange)", delay: 0.15 },
            { label: "Ultima actividad", value: -1, text: bots[0] ? timeAgo(bots[0].lastActivity) : "---", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", iconBg: "var(--primary-soft)", iconColor: "var(--primary)", delay: 0.2 },
          ].map((s) => (
            <BlurFade key={s.label} delay={s.delay}>
              <MagicCard
                className="rounded-xl border border-[var(--border-subtle)]"
                gradientColor="var(--primary-soft)"
                gradientOpacity={0.4}
                gradientFrom="var(--primary)"
                gradientTo="transparent"
              >
                <div className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: s.iconBg }}>
                    <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke={s.iconColor} strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
                    {s.label}
                  </p>
                  <span className="text-2xl font-bold" style={{ color: "var(--text-0)" }}>
                    {s.value >= 0 ? <NumberTicker value={s.value} delay={0.3} /> : s.text}
                  </span>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        {/* Bots Section */}
        <BlurFade delay={0.25}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold" style={{ color: "var(--text-0)" }}>
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--primary)" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Tus Bots
            </h3>
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "var(--green-soft)", color: "var(--green)" }}>
              {bots.filter(b => b.status === "active").length} activo
            </span>
          </div>
        </BlurFade>

        {loading ? (
          <div className="fb-card flex items-center gap-5 p-8">
            <div className="skeleton h-20 w-20 flex-shrink-0 rounded-2xl" />
            <div className="flex-1">
              <div className="skeleton mb-3 h-5 w-[35%]" />
              <div className="skeleton mb-2 h-4 w-[60%]" />
              <div className="skeleton h-3 w-[40%]" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bots.map((bot, i) => {
              const online = bot.status === "active";
              return (
                <BlurFade key={bot.id} delay={0.3 + i * 0.05}>
                  <button onClick={() => setSelectedBotId(bot.id)} className="group relative w-full cursor-pointer text-left">
                    <MagicCard
                      className="rounded-2xl border border-[var(--border-subtle)]"
                      gradientColor="var(--primary-soft)"
                      gradientOpacity={0.5}
                      gradientFrom="var(--primary)"
                      gradientTo="#42b72a"
                    >
                      <div className="flex items-center gap-6 p-8">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div
                            className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl font-extrabold text-white"
                            style={{ background: "linear-gradient(135deg, var(--primary), #42b72a)", boxShadow: "0 4px 20px rgba(24,119,242,0.25)" }}
                          >
                            C
                          </div>
                          {online && (
                            <div className="live-dot absolute -bottom-1 -right-1" style={{ border: "3px solid var(--bg-1)", width: 18, height: 18 }} />
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-2xl font-bold" style={{ color: "var(--text-0)" }}>{bot.name}</span>
                            {online && (
                              <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ color: "var(--green)", background: "var(--green-soft)" }}>
                                En linea
                              </span>
                            )}
                            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ color: "var(--primary)", background: "var(--primary-soft)" }}>
                              WhatsApp
                            </span>
                          </div>
                          <p className="mb-1 text-[15px]" style={{ color: "var(--text-2)" }}>{bot.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-[13px]" style={{ color: "var(--text-3)" }}>
                            <span className="flex items-center gap-1">
                              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12" />
                              </svg>
                              Kimi K2.5
                            </span>
                            <span className="flex items-center gap-1">
                              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {timeAgo(bot.lastActivity)}
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 group-hover:bg-[var(--primary-soft)]">
                          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={2}
                            className="transition-all duration-200 group-hover:translate-x-0.5 group-hover:stroke-[var(--primary)]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {online && <BorderBeam size={300} duration={10} colorFrom="var(--primary)" colorTo="var(--green)" />}
                    </MagicCard>
                  </button>
                </BlurFade>
              );
            })}
          </div>
        )}

        {/* Upcoming Features */}
        <BlurFade delay={0.4}>
          <h3 className="mb-4 mt-10 flex items-center gap-2 text-lg font-bold" style={{ color: "var(--text-0)" }}>
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="var(--orange)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Proximamente
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Estadisticas", desc: "Metricas de conversacion, tiempos de respuesta y satisfaccion del cliente", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", color: "var(--primary)" },
              { title: "Catalogo", desc: "Gestion de productos, precios y disponibilidad de refacciones automotrices", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z", color: "var(--orange)" },
              { title: "Automatizacion", desc: "Flujos automaticos para seguimiento de clientes, cotizaciones y recordatorios", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281", color: "var(--green)" },
              { title: "Reportes", desc: "Exportar datos, generar reportes PDF y analisis de rendimiento mensual", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", color: "var(--red)" },
            ].map((item, i) => (
              <BlurFade key={item.title} delay={0.45 + i * 0.05}>
                <div
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border p-6 transition-all duration-200 hover:shadow-md"
                  style={{ background: "var(--bg-1)", borderColor: "var(--border-subtle)" }}
                >
                  {/* Icon */}
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `color-mix(in srgb, ${item.color} 10%, transparent)` }}
                  >
                    <svg width={24} height={24} fill="none" viewBox="0 0 24 24" stroke={item.color} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <p className="mb-2 text-[15px] font-bold" style={{ color: "var(--text-0)" }}>{item.title}</p>
                  <p className="mb-4 flex-1 text-[13px] leading-relaxed" style={{ color: "var(--text-3)" }}>{item.desc}</p>
                  <span
                    className="inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold"
                    style={{ color: "var(--text-3)", background: "var(--bg-2)" }}
                  >
                    <svg width={10} height={10} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    En desarrollo
                  </span>
                </div>
              </BlurFade>
            ))}
          </div>
        </BlurFade>

        {/* Footer */}
        <BlurFade delay={0.6}>
          <div className="mt-12 text-center text-xs" style={{ color: "var(--text-3)" }}>
            Campos Herramientas Automotrices &copy; 2026 &middot; Panel de administracion v1.0
          </div>
        </BlurFade>
      </main>
    </div>
  );
}
