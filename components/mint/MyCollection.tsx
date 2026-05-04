"use client";
import { useNFTStore } from "@/lib/nftStore";
import { NFT_CATALOG } from "@/lib/nftCatalog";
import { NFTArt } from "./NFTArt";
import { ExternalLink, ImageOff } from "lucide-react";

export function MyCollection() {
  const minted = useNFTStore((s) => s.minted);

  if (minted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ImageOff size={28} className="text-ritual-muted mb-3" />
        <p className="text-sm text-ritual-muted">
          your collection is empty
        </p>
        <p className="text-xs text-ritual-muted mt-1">
          mint your first shrine NFT to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {minted.map((nft) => {
        const design = NFT_CATALOG.find((d) => d.id === nft.designId);
        if (!design) return null;
        return (
          <div
            key={nft.id}
            className="rounded-xl border border-ritual-border bg-ritual-surface p-3 space-y-2"
          >
            <NFTArt design={design} tokenId={nft.tokenId} size={180} />
            <div className="space-y-1 px-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ritual-fg truncate">{design.name}</span>
                <span className="text-ritual-muted tabular-nums">#{nft.tokenId}</span>
              </div>
              <a
                href={`https://testnet-explorer.ritual.net/tx/${nft.txHash}`}
                target="_blank"
                className="flex items-center gap-1 text-[10px] text-ritual-muted hover:text-ritual-accent"
              >
                {nft.txHash.slice(0, 6)}…{nft.txHash.slice(-4)}
                <ExternalLink size={9} />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}