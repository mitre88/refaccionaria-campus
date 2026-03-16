"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationView } from "./ConversationView";
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

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Sin actividad";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Justo ahora";
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

export function Dashboard({ user, onLogout }: { user: string; onLogout: () => void }) {
  const [bot, setBot] = useState<Bot | null>(null);
  const [showConversations, setShowConversations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBot = useCallback(async () => {
    try {
      const res = await fetch("/api/bots");
      const data = await res.json();
      if (data.bots) {
        const campos = data.bots.find((b: Bot) => b.id === "campos");
        if (campos) setBot(campos);
        else setError("Bot Campos no encontrado");
      } else {
        setError(data.error || "Error cargando datos");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBot();
    const interval = setInterval(fetchBot, 30000);
    return () => clearInterval(interval);
  }, [fetchBot]);

  if (showConversations && bot) {
    return (
      <ConversationView
        botId={bot.id}
        botName={bot.name}
        onBack={() => setShowConversations(false)}
      />
    );
  }

  const isOnline = bot?.status === "active";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500"
        style={{ background: "color-mix(in srgb, var(--bg-base) 80%, transparent)", borderColor: "var(--border)" }}
      >
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-soft)" }}
            >
              <svg className="w-[18px] h-[18px]" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Refaccionaria Campos
              </h1>
              <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>Panel de gestion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-[13px] px-2" style={{ color: "var(--text-secondary)" }}>
              {user}
            </span>
            <button
              onClick={() => {
                showToast("Sesion cerrada", "info");
                setTimeout(onLogout, 500);
              }}
              className="text-[13px] px-3 py-1.5 rounded-lg btn-press transition-all duration-200"
              style={{ color: "var(--text-secondary)", background: "var(--bg-surface-hover)" }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 py-8">
        {loading && (
          <div className="space-y-4 animate-fade-in">
            <div className="skeleton h-6 w-48" />
            <div className="glass-card p-8">
              <div className="skeleton h-5 w-32 mb-4" />
              <div className="skeleton h-4 w-64 mb-3" />
              <div className="skeleton h-4 w-48" />
            </div>
          </div>
        )}

        {error && (
          <div className="glass-card p-6 text-center animate-fade-in">
            <svg className="w-10 h-10 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>{error}</p>
            <button
              onClick={fetchBot}
              className="mt-3 text-[13px] font-medium btn-press px-4 py-1.5 rounded-lg"
              style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && bot && (
          <div className="animate-fade-in">
            {/* Section Title */}
            <div className="mb-6">
              <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Asistente Campitos
              </h2>
              <p className="text-[14px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Monitorea la actividad del bot de WhatsApp
              </p>
            </div>

            {/* Bot Status Card */}
            <div className="glass-card p-6 mb-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-[22px] font-bold"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                  >
                    C
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {bot.name}
                    </h3>
                    <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {bot.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={isOnline ? {
                      background: "#22c55e",
                      animation: "pulse-glow 2s ease-in-out infinite",
                    } : { background: "#71717a" }}
                  />
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: isOnline ? "#22c55e" : "var(--text-tertiary)" }}
                  >
                    {isOnline ? "En linea" : "Desconectado"}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Canal", value: "WhatsApp", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
                  { label: "Modelo IA", value: "Kimi K2.5", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                  { label: "Ultima actividad", value: timeAgo(bot.lastActivity), icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { label: "Ultimo contacto", value: bot.lastContact ? bot.lastContact.replace("+521", "+52 1 ") : "---", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-3.5 transition-colors duration-300"
                    style={{ background: "var(--bg-surface-hover)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-3.5 h-3.5" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                      </svg>
                      <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowConversations(true)}
              className="w-full glass-card p-5 flex items-center justify-between group cursor-pointer btn-press"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{ background: "var(--accent-soft)" }}
                >
                  <svg className="w-5 h-5" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    Ver Conversaciones
                  </p>
                  <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    Historial completo de interacciones
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: "var(--text-tertiary)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
