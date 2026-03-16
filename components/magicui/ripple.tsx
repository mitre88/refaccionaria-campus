"use client";

import { cn } from "@/lib/utils";

interface RippleProps {
  className?: string;
  color?: string;
  count?: number;
}

export function Ripple({ className, color = "var(--accent)", count = 4 }: RippleProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${(i + 1) * 25}%`,
            height: `${(i + 1) * 25}%`,
            transform: "translate(-50%, -50%)",
            border: `1px solid ${color}`,
            opacity: 0.08 - i * 0.015,
            animation: `ripple-expand ${3 + i * 0.5}s ease-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
