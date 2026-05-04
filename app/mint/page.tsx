import { MintTabs } from "@/components/mint/MintTabs";
import { BadgeCheck, Sparkles } from "lucide-react";
import { SHRINE_TOKEN } from "@/lib/contracts";

export default function MintPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-ritual-muted">
          / module 03
        </p>
        <h1 className="text-4xl font-mono tracking-tight">mint</h1>
        <p className="text-ritual-muted max-w-xl">
          Spend your Shrine points to mint exclusive NFTs. Each design has
          limited supply — once it's gone, it's gone.
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          border border-ritual-border bg-ritual-surface text-xs font-mono">
            <Sparkles size={11} className="text-ritual-accent" />
            <span className="text-ritual-muted">points → NFT economy</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          border border-ritual-border bg-ritual-surface text-xs font-mono">
            <span className="text-base leading-none">{SHRINE_TOKEN.logo}</span>
            <span className="font-semibold">{SHRINE_TOKEN.symbol}</span>
            <BadgeCheck size={11} className="text-ritual-verified" />
            <span className="text-ritual-muted">verified contract</span>
            <span className="text-ritual-border">·</span>
            <code className="text-[10px] text-ritual-muted">
              {SHRINE_TOKEN.address.slice(0, 8)}…{SHRINE_TOKEN.address.slice(-6)}
            </code>
          </div>
        </div>
      </header>

      <MintTabs />

      <p className="text-center text-xs text-ritual-muted">
        all mints are recorded on the ritual testnet ledger
      </p>
    </div>
  );
}