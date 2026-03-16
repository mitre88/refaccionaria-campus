"use client";

import { useState } from "react";
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
        showToast("Usuario o contrasena incorrectos", "error");
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      {/* Background */}
      <div className="login-bg" />

      <div className={`anim-enter ${shake ? "anim-shake" : ""}`} style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Card */}
        <div className="fb-card" style={{ padding: "40px 32px 32px", textAlign: "center" }}>
          {/* Logo */}
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px",
            background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(194, 113, 21, 0.3)",
          }}>
            <svg width={36} height={36} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-0)", marginBottom: 4 }}>
            Refaccionaria Campos
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-2)", marginBottom: 28 }}>
            Inicia sesion para acceder al panel
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="input" placeholder="Usuario" required autoComplete="username"
              style={{ borderRadius: "var(--radius)", background: "var(--bg-2)", border: "1px solid var(--border-subtle)", padding: "16px", fontSize: 17 }}
            />
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input" placeholder="Contrasena" required autoComplete="current-password"
              style={{ borderRadius: "var(--radius)", background: "var(--bg-2)", border: "1px solid var(--border-subtle)", padding: "16px", fontSize: 17 }}
            />
            <button
              type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: "100%", height: 52, fontSize: 17, borderRadius: "var(--radius)", marginTop: 4, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verificando..." : "Iniciar sesion"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500, letterSpacing: "0.04em" }}>
          CAMPOS HERRAMIENTAS AUTOMOTRICES
        </p>
      </div>
    </div>
  );
}
