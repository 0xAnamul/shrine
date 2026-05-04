"use client";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePoints } from "@/lib/store";
import { Sparkles } from "lucide-react";

export function Header() {
  const points = usePoints((s) => s.points);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ritual-bg/80 border-b border-ritual-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-lg tracking-tight">
          <span className="text-ritual-accent">▲</span> ritualverse
        </Link>

        <nav className="hidden md:flex gap-6 text-sm text-ritual-muted">
          <Link href="/snake" className="hover:text-ritual-fg">snake</Link>
          <Link href="/swap" className="hover:text-ritual-fg">swap</Link>
          <Link href="/mint" className="hover:text-ritual-fg">mint</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full
                          border border-ritual-border bg-ritual-surface
                          text-sm font-mono">
            <Sparkles size={14} className="text-ritual-accent" />
            <span className="text-ritual-muted">points</span>
            <span className="text-ritual-fg font-semibold tabular-nums">
              {points.toLocaleString()}
            </span>
          </div>
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </header>
  );
}