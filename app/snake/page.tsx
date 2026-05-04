import { SnakeGame } from "@/components/snake/SnakeGame";
import { Sparkles } from "lucide-react";

export default function SnakePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-ritual-muted">
          / module 01
        </p>
        <h1 className="text-4xl font-mono tracking-tight">snake</h1>
        <p className="text-ritual-muted max-w-xl">
          Classic snake. Every apple = {`10`} points. Your final score syncs
          directly to your global Shrine balance.
        </p>
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full
                        border border-ritual-border bg-ritual-surface text-xs">
          <Sparkles size={12} className="text-ritual-accent" />
          <span className="text-ritual-muted">
            score → shrine points (1:1 auto-sync)
          </span>
        </div>
      </header>

      <SnakeGame />
    </div>
  );
}