"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ShimmerButton({
  shimmerColor = "rgba(255,255,255,0.15)",
  shimmerSize = "0.1em",
  borderRadius = "12px",
  shimmerDuration = "2.5s",
  background = "var(--accent)",
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden",
        "font-semibold text-white transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      style={{
        borderRadius,
        background,
        boxShadow: "0 4px 20px rgba(194,113,21,0.3)",
      }}
      {...props}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <div
          className="absolute inset-0 animate-shimmer-slide"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
            backgroundSize: "200% 100%",
            animation: `shimmer-slide ${shimmerDuration} ease-in-out infinite`,
          }}
        />
      </div>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
