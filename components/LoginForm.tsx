"use client";

import { useState } from "react";
import { showToast } from "./Toast";

const TOOL_ICONS = [
  // Wrench
  "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085",
  // Cog/gear
  "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  // Bolt/lightning
  "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  // Shield/check
  "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  // Truck
  "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677",
];

const FLOAT_POSITIONS = [
  { top: "8%", left: "5%", size: 80, delay: "0s", dur: "18s" },
  { top: "15%", right: "8%", size: 60, delay: "3s", dur: "22s" },
  { top: "45%", left: "3%", size: 50, delay: "1s", dur: "20s" },
  { bottom: "20%", right: "5%", size: 70, delay: "5s", dur: "19s" },
  { bottom: "10%", left: "12%", size: 55, delay: "2s", dur: "21s" },
];

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
      <div className="login-bg">
        {/* Floating automotive tool silhouettes */}
        <div className="login-tools">
          {FLOAT_POSITIONS.map((pos, i) => (
            <div
              key={i}
              style={{
                ...pos,
                animation: `float-tool ${pos.dur} ease-in-out ${pos.delay} infinite`,
              }}
            >
              <svg width={pos.size} height={pos.size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={TOOL_ICONS[i]} />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <div className={`anim-enter ${shake ? "anim-shake" : ""}`} style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Card */}
        <div className="fb-card" style={{ padding: "40px 32px 32px", textAlign: "center" }}>
          {/* Logo */}
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px",
            background: "linear-gradient(135deg, var(--accent), #8b4513)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(194, 113, 21, 0.4)",
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
            <div style={{ position: "relative" }}>
              <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.8}
                style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="input" placeholder="Usuario" required autoComplete="username"
                style={{ borderRadius: "var(--radius)", background: "var(--bg-2)", border: "1px solid var(--border-subtle)", padding: "16px 16px 16px 46px", fontSize: 17 }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.8}
                style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input" placeholder="Contrasena" required autoComplete="current-password"
                style={{ borderRadius: "var(--radius)", background: "var(--bg-2)", border: "1px solid var(--border-subtle)", padding: "16px 16px 16px 46px", fontSize: 17 }}
              />
            </div>
            <button
              type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: "100%", height: 52, fontSize: 17, borderRadius: "var(--radius)", marginTop: 4, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verificando..." : "Iniciar sesion"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0.06em" }}>
          CAMPOS HERRAMIENTAS AUTOMOTRICES
        </p>
      </div>
    </div>
  );
}
