"use client";

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

const channelIcons: Record<string, string> = {
  whatsapp: "M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.44 1.27 4.89L2 22l5.17-1.35A9.937 9.937 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z",
};

export function BotCard({ bot, onClick }: { bot: Bot; onClick: () => void }) {
  const isOnline = bot.status === "active";

  return (
    <button
      onClick={onClick}
      className="glass-card p-5 text-left w-full cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-sm">
            {bot.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-sm group-hover:text-amber-400 transition">
              {bot.name}
            </h3>
            <p className="text-xs text-gray-500">{bot.description.substring(0, 40)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-600"}`}
            style={isOnline ? { animation: "pulse-dot 2s ease-in-out infinite", boxShadow: "0 0 6px rgba(34,197,94,0.4)" } : {}}
          />
          <span className="text-[10px] text-gray-500">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d={channelIcons[bot.channel] || channelIcons.whatsapp} />
          </svg>
          <span>{bot.channel}</span>
          <span className="text-gray-700">|</span>
          <span className="truncate">{bot.model}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{timeAgo(bot.lastActivity)}</span>
          {bot.lastContact && (
            <span className="text-gray-600 font-mono text-[10px]">
              {bot.lastContact}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-gray-600">{bot.sessionsCount} sesion(es)</span>
        <span className="text-[10px] text-amber-500/60 group-hover:text-amber-500 transition">
          Ver conversaciones →
        </span>
      </div>
    </button>
  );
}
