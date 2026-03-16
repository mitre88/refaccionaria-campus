"use client";

import { useState } from "react";
import { showToast } from "./Toast";
import { BlurFade } from "./magicui/blur-fade";
import { ShimmerButton } from "./magicui/shimmer-button";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1530124566582-a45a7e3d0a69?w=800&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
  "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80",
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
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
    <div className="flex min-h-screen">
      {/* Left — Image Gallery / Brand Hero */}
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        {/* Background image with ken burns */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${GALLERY_IMAGES[0]})`,
            animation: "ken-burns 30s ease-in-out infinite alternate",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

        {/* Brand content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <BlurFade delay={0.1}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white/80">Campos CRM</span>
            </div>
          </BlurFade>

          <BlurFade delay={0.3}>
            <div className="max-w-md">
              <h2 className="mb-4 text-4xl font-bold leading-tight text-white">
                Tu negocio automotriz, bajo control total
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/60">
                Gestiona conversaciones con clientes, monitorea tu bot de WhatsApp y optimiza la atencion al cliente desde un solo lugar.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", text: "WhatsApp Bot" },
                  { icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z", text: "Estadisticas" },
                  { icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281", text: "Automatizacion" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                    <span className="text-sm font-medium text-white/80">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.5}>
            {/* Thumbnail gallery */}
            <div className="flex gap-3">
              {GALLERY_IMAGES.slice(1).map((src, i) => (
                <div
                  key={i}
                  className="h-20 w-32 overflow-hidden rounded-xl border-2 border-white/10 bg-cover bg-center"
                  style={{ backgroundImage: `url(${src})` }}
                />
              ))}
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-[480px] lg:flex-shrink-0" style={{ background: "var(--bg-1)" }}>
        <div className={`w-full max-w-[380px] ${shake ? "anim-shake" : ""}`}>
          <BlurFade delay={0.1}>
            {/* Logo */}
            <div className="mb-2 flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "var(--primary)", boxShadow: "0 4px 20px rgba(24,119,242,0.25)" }}
              >
                <svg width={28} height={28} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
                </svg>
              </div>
            </div>

            <h1 className="mb-1 text-3xl font-bold tracking-tight" style={{ color: "var(--text-0)" }}>
              Refaccionaria Campos
            </h1>
            <p className="mb-8 text-base" style={{ color: "var(--text-2)" }}>
              Inicia sesion en tu panel de administracion
            </p>
          </BlurFade>

          <BlurFade delay={0.2}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--text-1)" }}>Usuario</label>
                <div className="relative">
                  <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <input
                    type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="input" placeholder="Escribe tu usuario" required autoComplete="username"
                    style={{ paddingLeft: 42, borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--text-1)" }}>Contrasena</label>
                <div className="relative">
                  <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--text-3)" strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="input" placeholder="Escribe tu contrasena" required autoComplete="current-password"
                    style={{ paddingLeft: 42, borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>
              <ShimmerButton
                type="submit"
                disabled={loading}
                className="mt-2 h-[50px] w-full rounded-xl text-[17px]"
                shimmerColor="rgba(255,255,255,0.15)"
                background="var(--primary)"
              >
                {loading ? "Verificando..." : "Iniciar sesion"}
              </ShimmerButton>
            </form>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="mt-8 rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-2)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "var(--green-soft)" }}>
                  <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="var(--green)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Conexion segura</p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>Tus datos estan protegidos con encriptacion SSL</p>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.5}>
            <p className="mt-8 text-center text-xs font-medium" style={{ color: "var(--text-3)" }}>
              Campos Herramientas Automotrices &copy; 2026
            </p>
          </BlurFade>
        </div>

        {/* Mobile: show bg image */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center opacity-5 lg:hidden"
          style={{ backgroundImage: `url(${GALLERY_IMAGES[0]})` }}
        />
      </div>
    </div>
  );
}
