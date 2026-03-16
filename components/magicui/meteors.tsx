"use client";

import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export function Meteors({ number = 15, className }: MeteorsProps) {
  const meteors = Array.from({ length: number }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 3 + 3}s`,
    size: Math.random() * 1.5 + 0.5,
  }));

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full"
          style={{
            top: "-5%",
            left: m.left,
            width: `${m.size}px`,
            height: `${m.size * 60}px`,
            background: `linear-gradient(to bottom, var(--accent), transparent)`,
            opacity: 0.3,
            transform: "rotate(-30deg)",
            animation: `meteor-fall ${m.duration} linear ${m.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
