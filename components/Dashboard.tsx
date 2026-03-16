"use client";

import { useState, useEffect, useCallback } from "react";
import { BotCard } from "./BotCard";
import { ConversationView } from "./ConversationView";

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

export function Dashboard({ user, onLogout }: { user: string; onLogout: () => void }) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBots = useCallback(async () => {
    try {
      const res = await fetch("/api/bots");
      const data = await res.json();
      if (data.bots) {
        setBots(data.bots);
      } else {
        setError(data.error || "Error cargando bots");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBots();
    const interval = setInterval(fetchBots, 30000);
    return () => clearInterval(interval);
  }, [fetchBots]);

  if (selectedBot) {
    const bot = bots.find(b => b.id === selectedBot);
    return (
      <ConversationView
        botId={selectedBot}
        botName={bot?.name || selectedBot}
        onBack={() => setSelectedBot(null)}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Refaccionaria Campus</h1>
              <p className="text-xs text-gray-500">CRM de bots</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Hola, {user}</span>
            <button
              onClick={onLogout}
              className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded hover:bg-white/5"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Bots Activos</h2>
          <p className="text-sm text-gray-500">Selecciona un bot para ver sus conversaciones</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="glass-card p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={fetchBots} className="text-xs text-amber-500 mt-2 hover:underline">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                onClick={() => setSelectedBot(bot.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
