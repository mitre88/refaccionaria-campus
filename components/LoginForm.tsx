"use client";

import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { showToast } from "./Toast";

export function LoginForm({ onLogin }: { onLogin: (user: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast("Bienvenido, " + data.user, "success");
        setTimeout(() => onLogin(data.user), 400);
      } else {
        showToast(data.error || "Credenciales incorrectas", "error");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      showToast("Error de conexion", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative" style={{ background: "var(--bg-base)" }}>
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[380px] animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500"
            style={{ background: "var(--accent-soft)", boxShadow: "0 0 40px var(--accent-soft)" }}
          >
            <svg className="w-10 h-10" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Refaccionaria Campos
          </h1>
          <p className="text-[15px] mt-1.5 font-light" style={{ color: "var(--text-secondary)" }}>
            Panel de gestion
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`glass-card p-7 space-y-5 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          style={{ ["--shake" as string]: shake ? "1" : "0" }}
        >
          <div>
            <label className="block text-[13px] font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-[15px] focus:outline-none focus-ring transition-all duration-300"
              style={{
                background: "var(--bg-surface-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              placeholder="Ingresa tu usuario"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-[15px] focus:outline-none focus-ring transition-all duration-300"
              style={{
                background: "var(--bg-surface-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              placeholder="Ingresa tu contrasena"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold text-[15px] rounded-xl py-3 btn-press focus-ring transition-all duration-300"
            style={{
              background: "var(--accent)",
              color: "#000",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                </svg>
                Verificando...
              </span>
            ) : (
              "Iniciar Sesion"
            )}
          </button>
        </form>

        <p className="text-center text-[13px] mt-8 tracking-wide" style={{ color: "var(--text-tertiary)" }}>
          Campos Herramientas Automotrices
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
