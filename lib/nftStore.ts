import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MintedNFT {
  id: string;            // unique mint id (e.g. ember-0001)
  designId: string;      // links to NFT_CATALOG
  tokenId: number;       // sequential
  txHash: string;
  timestamp: number;
  costPaid: number;
}

interface NFTState {
  minted: MintedNFT[];
  mintedByDesign: Record<string, number>; // designId -> count

  recordMint: (designId: string, costPaid: number, txHash: string) => MintedNFT;
  reset: () => void;
}

const fakeTxHash = () =>
  "0x" + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)).join("");

export const generateTxHash = fakeTxHash;

export const useNFTStore = create<NFTState>()(
  persist(
    (set, get) => ({
      minted: [],
      mintedByDesign: {},

      recordMint: (designId, costPaid, txHash) => {
        const s = get();
        const count = (s.mintedByDesign[designId] ?? 0) + 1;
        const nft: MintedNFT = {
          id: `${designId}-${String(count).padStart(4, "0")}`,
          designId,
          tokenId: s.minted.length + 1,
          txHash,
          timestamp: Date.now(),
          costPaid,
        };
        set({
          minted: [nft, ...s.minted],
          mintedByDesign: { ...s.mintedByDesign, [designId]: count },
        });
        return nft;
      },

      reset: () => set({ minted: [], mintedByDesign: {} }),
    }),
    { name: "shrine-nft-store" }
  )
);