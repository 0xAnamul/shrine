"use client";
import { useState } from "react";
import { MintCard } from "./MintCard";
import { MyCollection } from "./MyCollection";
import { NFT_CATALOG } from "@/lib/nftCatalog";
import { useNFTStore } from "@/lib/nftStore";

export function MintTabs() {
  const [tab, setTab] = useState<"gallery" | "collection">("gallery");
  const mintedCount = useNFTStore((s) => s.minted.length);

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-lg border border-ritual-border bg-ritual-surface p-1">
        <TabBtn active={tab === "gallery"} onClick={() => setTab("gallery")}>
          gallery
        </TabBtn>
        <TabBtn active={tab === "collection"} onClick={() => setTab("collection")}>
          my collection
          {mintedCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px]
                             bg-ritual-accent text-black tabular-nums">
              {mintedCount}
            </span>
          )}
        </TabBtn>
      </div>

      {tab === "gallery" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NFT_CATALOG.map((design) => (
            <MintCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <MyCollection />
      )}
    </div>
  );
}

function TabBtn({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm font-mono transition flex items-center
                  ${active
                    ? "bg-ritual-bg text-ritual-fg"
                    : "text-ritual-muted hover:text-ritual-fg"}`}
    >
      {children}
    </button>
  );
}