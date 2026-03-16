"use client";

import { useState } from "react";
import { showToast } from "./Toast";
import { Particles } from "./magicui/particles";
import { BlurFade } from "./magicui/blur-fade";
import { ShimmerButton } from "./magicui/shimmer-button";
import { Meteors } from "./magicui/meteors";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated particles background */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={80}
        color="#c27115"
        size={1.2}
        speed={0.2}
        vy={-0.05}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-[rgba(194,113,21,0.08)] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-[rgba(139,69,19,0.06)] blur-[100px]" />
      </div>

      {/* Meteors */}
      <Meteors number={12} />

      {/* Card */}
      <BlurFade delay={0.1} yOffset={20} blur="12px">
        <div
          className={`relative z-10 w-full max-w-[420px] px-5 ${shake ? "anim-shake" : ""}`}
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-10 text-center backdrop-blur-xl"
            style={{ boxShadow: "0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}
          >
            {/* Logo */}
            <BlurFade delay={0.2}>
              <div
                className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #c27115, #8b4513)",
                  boxShadow: "0 8px 32px rgba(194, 113, 21, 0.4), 0 0 60px rgba(194, 113, 21, 0.15)",
                }}
              >
                <svg width={40} height={40} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
                </svg>
              </div>
            </BlurFade>

            <BlurFade delay={0.3}>
              <h1 className="mb-1 text-3xl font-bold tracking-tight text-white">
                Refaccionaria Campos
              </h1>
              <p className="mb-8 text-base text-white/40">
                Panel de administracion
              </p>
            </BlurFade>

            <BlurFade delay={0.4}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <input
                    type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuario" required autoComplete="username"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.06] py-4 pl-12 pr-4 text-[17px] text-white placeholder-white/30 outline-none transition-all focus:border-[#c27115]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#c27115]/30"
                  />
                </div>
                <div className="relative">
                  <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth={1.8}
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contrasena" required autoComplete="current-password"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.06] py-4 pl-12 pr-4 text-[17px] text-white placeholder-white/30 outline-none transition-all focus:border-[#c27115]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#c27115]/30"
                  />
                </div>
                <ShimmerButton
                  type="submit"
                  disabled={loading}
                  className="mt-1 h-[52px] w-full text-[17px]"
                  shimmerColor="rgba(255,255,255,0.12)"
                  background="linear-gradient(135deg, #c27115, #a85f0e)"
                >
                  {loading ? "Verificando..." : "Iniciar sesion"}
                </ShimmerButton>
              </form>
            </BlurFade>
          </div>

          <BlurFade delay={0.6}>
            <p className="mt-6 text-center text-xs font-medium uppercase tracking-[0.12em] text-white/25">
              Campos Herramientas Automotrices
            </p>
          </BlurFade>
        </div>
      </BlurFade>
    </div>
  );
}
