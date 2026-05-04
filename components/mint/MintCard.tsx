"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Sparkles, Loader2, BadgeCheck, Lock, ExternalLink, Check } from "lucide-react";
import { NFTArt } from "./NFTArt";
import { type NFTDesign, RARITY_STYLES, NFT_PAYMENT_TOKEN } from "@/lib/nftCatalog";
import { useNFTStore, generateTxHash } from "@/lib/nftStore";
import { usePoints } from "@/lib/store";

type MintState =
  | { status: "idle" }
  | { status: "minting" }
  | { status: "success"; tokenId: number; txHash: string }
  | { status: "error"; message: string };

export function MintCard({ design }: { design: NFTDesign }) {
  const { isConnected } = useAccount();
  const points = usePoints((s) => s.points);
  const spendPoints = usePoints((s) => s.spendPoints);

  const recordMint = useNFTStore((s) => s.recordMint);
  const mintedCount = useNFTStore((s) => s.mintedByDesign[design.id] ?? 0);

  const [state, setState] = useState<MintState>({ status: "idle" });

  const rarity = RARITY_STYLES[design.rarity];
  const remaining = design.supply - mintedCount;
  const soldOut = remaining <= 0;
  const insufficientPoints = points < design.cost;
  const canMint =
    isConnected && !soldOut && !insufficientPoints && state.status === "idle";

  const handleMint = async () => {
    if (!canMint) return;
    setState({ status: "minting" });

    // Simulate confirmation delay
    await new Promise((r) => setTimeout(r, 1800));

    // Atomic spend → if insufficient now, abort
    const ok = spendPoints(design.cost);
    if (!ok) {
      setState({ status: "error", message: "Insufficient points at confirmation" });
      return;
    }

    const txHash = generateTxHash();
    const nft = recordMint(design.id, design.cost, txHash);
    setState({ status: "success", tokenId: nft.tokenId, txHash });

    // auto-reset after 5s
    setTimeout(() => setState({ status: "idle" }), 5000);
  };

  return (
    <div
      className={`rounded-2xl border bg-ritual-surface p-4 space-y-3 transition
                  hover:border-ritual-accent ${
                    soldOut ? "border-ritual-border opacity-70" : "border-ritual-border"
                  }`}
    >
      {/* Art */}
      <div className={`flex justify-center p-2 rounded-xl ring-1 ${rarity.ring}`}>
        <NFTArt design={design} size={200} />
      </div>

      {/* Title row */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-base">{design.name}</h3>
          <span className={`text-[10px] uppercase tracking-widest ${rarity.text}`}>
            {rarity.label}
          </span>
        </div>
        <p className="text-xs text-ritual-muted leading-snug">{design.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="rounded-lg border border-ritual-border bg-ritual-bg p-2">
          <div className="text-ritual-muted text-[10px] uppercase">cost</div>
          <div className="flex items-center gap-1 text-ritual-accent">
            <Sparkles size={11} />
            <span className="tabular-nums font-semibold">
              {design.cost.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-ritual-border bg-ritual-bg p-2">
          <div className="text-ritual-muted text-[10px] uppercase">supply</div>
          <div className="text-ritual-fg tabular-nums">
            {mintedCount} / {design.supply}
          </div>
        </div>
      </div>

      {/* Contract reference */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-ritual-muted px-1">
        <span>paid in</span>
        <span className="text-ritual-fg">{NFT_PAYMENT_TOKEN.symbol}</span>
        <BadgeCheck size={11} className="text-ritual-verified" />
        <span className="text-ritual-border">·</span>
        <code>
          {NFT_PAYMENT_TOKEN.address.slice(0, 6)}…{NFT_PAYMENT_TOKEN.address.slice(-4)}
        </code>
      </div>

      {/* Action */}
      <button
        onClick={handleMint}
        disabled={!canMint}
        className="w-full py-2.5 rounded-xl font-semibold transition text-sm
                   bg-ritual-accent text-black hover:opacity-90
                   disabled:bg-ritual-border disabled:text-ritual-muted
                   disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        {state.status === "minting" && (
          <>
            <Loader2 size={14} className="animate-spin" /> minting…
          </>
        )}
        {state.status === "success" && (
          <>
            <Check size={14} /> minted #{String(state.tokenId).padStart(4, "0")}
          </>
        )}
        {state.status === "idle" && (
          <>
            {!isConnected ? (
              <>
                <Lock size={12} /> connect wallet
              </>
            ) : soldOut ? (
              "sold out"
            ) : insufficientPoints ? (
              <>
                need {(design.cost - points).toLocaleString()} more pts
              </>
            ) : (
              <>
                mint · {design.cost.toLocaleString()} pts
              </>
            )}
          </>
        )}
        {state.status === "error" && state.message}
      </button>

      {/* Success tx link */}
      {state.status === "success" && (
        <a
          href={`https://testnet-explorer.ritual.net/tx/${state.txHash}`}
          target="_blank"
          className="flex items-center justify-center gap-1 text-[10px] text-ritual-muted hover:text-ritual-accent"
        >
          {state.txHash.slice(0, 10)}…{state.txHash.slice(-6)} <ExternalLink size={9} />
        </a>
      )}
    </div>
  );
}