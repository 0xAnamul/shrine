"use client";
import type { NFTDesign } from "@/lib/nftCatalog";

export function NFTArt({
  design,
  tokenId,
  size = 220,
}: {
  design: NFTDesign;
  tokenId?: number;
  size?: number;
}) {
  const [c1, c2] = design.gradient;

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-ritual-border"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 20%, ${c1}33, transparent 60%),
                     linear-gradient(135deg, ${c2}, #0a0a0a 80%)`,
      }}
    >
      {/* dot grid backdrop */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, ${c1}66 1px, transparent 1px)`,
          backgroundSize: "14px 14px",
        }}
      />

      {/* glowing glyph */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-7xl font-mono select-none"
          style={{
            color: c1,
            textShadow: `0 0 24px ${c1}, 0 0 60px ${c1}99`,
          }}
        >
          {design.glyph}
        </span>
      </div>

      {/* corner glints */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-white/40">
        SHRINE
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/40 tabular-nums">
        #{tokenId ? String(tokenId).padStart(4, "0") : "????"}
      </div>

      {/* scanline */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
    </div>
  );
}