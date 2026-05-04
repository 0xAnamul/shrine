"use client";
import { useSwapStore } from "@/lib/swapStore";
import { ArrowRight, ExternalLink } from "lucide-react";

export function SwapHistory() {
  const history = useSwapStore((s) => s.history);

  if (history.length === 0) {
    return (
      <div className="text-center text-xs text-ritual-muted py-8">
        no swaps yet — your history will appear here
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs uppercase tracking-widest text-ritual-muted px-1">
        recent swaps
      </h3>
      {history.map((h) => (
        <div
          key={h.id}
          className="flex items-center justify-between p-3 rounded-lg
                     border border-ritual-border bg-ritual-surface text-sm font-mono"
        >
          <div className="flex items-center gap-2">
            <span className="text-ritual-fg">{h.amountIn.toFixed(2)} {h.from}</span>
            <ArrowRight size={12} className="text-ritual-muted" />
            <span className="text-ritual-accent">{h.amountOut.toFixed(2)} {h.to}</span>
          </div>
          <a
            href={`https://testnet-explorer.ritual.net/tx/${h.txHash}`}
            target="_blank"
            className="text-xs text-ritual-muted hover:text-ritual-accent flex items-center gap-1"
          >
            {h.txHash.slice(0, 6)}…{h.txHash.slice(-4)}
            <ExternalLink size={10} />
          </a>
        </div>
      ))}
    </div>
  );
}