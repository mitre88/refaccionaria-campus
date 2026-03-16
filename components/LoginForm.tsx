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
        showToast("Bienvenido", "success");
        setTimeout(() => onLogin(data.user), 300);
      } else {
        showToast("Credenciales incorrectas", "error");
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
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg-0)" }}>
      <div className="absolute top-4 right-4"><ThemeToggle /></div>

      <div className={`w-full max-w-[400px] anim-enter ${shake ? "anim-shake" : ""}`}>
        {/* Brand */}
        <div className="text-center mb-12">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "var(--accent-soft)",
              boxShadow: "var(--shadow-glow)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg width={44} height={44} fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={1.3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 34px)", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text-0)" }}>
            Refaccionaria Campos
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-2)", marginTop: 6, fontWeight: 400 }}>
            Panel de gestion
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card" style={{ padding: "32px" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Tu usuario"
              required
              autoComplete="username"
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
              Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Tu contrasena"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", height: 52, fontSize: 16, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                </svg>
                Verificando...
              </span>
            ) : "Iniciar sesion"}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: 32, fontSize: 13, color: "var(--text-3)", letterSpacing: "0.05em", fontWeight: 500 }}>
          CAMPOS HERRAMIENTAS AUTOMOTRICES
        </p>
      </div>
    </div>
  );
}
