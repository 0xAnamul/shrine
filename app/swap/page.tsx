import { SwapCard } from "@/components/swap/SwapCard";
import { SwapHistory } from "@/components/swap/SwapHistory";
import { BadgeCheck, Sparkles } from "lucide-react";
import { SHRINE_TOKEN, SWAP_REWARD_POINTS } from "@/lib/contracts";

export default function SwapPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-ritual-muted">
          / module 02
        </p>
        <h1 className="text-4xl font-mono tracking-tight">swap</h1>
        <p className="text-ritual-muted max-w-xl">
          Trade RITUAL ↔ SHRINE on the Ritual Testnet AMM.
          Earn <span className="text-ritual-accent">+{SWAP_REWARD_POINTS} points</span> on every successful swap.
        </p>

        {/* Verified token chip */}
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full
                        border border-ritual-border bg-ritual-surface text-xs font-mono">
          <span className="text-lg leading-none">{SHRINE_TOKEN.logo}</span>
          <span className="font-semibold">{SHRINE_TOKEN.symbol}</span>
          <BadgeCheck size={12} className="text-ritual-verified" />
          <span className="text-ritual-muted">verified</span>
          <span className="text-ritual-border">·</span>
          <code className="text-[10px] text-ritual-muted">
            {SHRINE_TOKEN.address.slice(0, 8)}…{SHRINE_TOKEN.address.slice(-6)}
          </code>
        </div>
      </header>

      <SwapCard />

      <div className="max-w-md mx-auto w-full">
        <SwapHistory />
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-ritual-muted flex items-center justify-center gap-1">
        <Sparkles size={11} className="text-ritual-accent" />
        mock liquidity pool · constant product AMM (x·y=k) · 0.3% fee
      </p>
    </div>
  );
}