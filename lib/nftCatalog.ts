import { SHRINE_TOKEN } from "./contracts";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface NFTDesign {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  cost: number;          // points
  supply: number;        // max mintable
  glyph: string;         // emoji/symbol used in art
  gradient: [string, string]; // tailwind-friendly hex pair
}

export const NFT_CATALOG: NFTDesign[] = [
  {
    id: "ember",
    name: "Ember Shard",
    description: "A flicker from the Shrine's eternal flame.",
    rarity: "common",
    cost: 250,
    supply: 1000,
    glyph: "✦",
    gradient: ["#f97316", "#7c2d12"],
  },
  {
    id: "ritual-rune",
    name: "Ritual Rune",
    description: "Etched in the foundation block of the Ritual chain.",
    rarity: "rare",
    cost: 750,
    supply: 500,
    glyph: "◈",
    gradient: ["#fb923c", "#1e293b"],
  },
  {
    id: "shrine-mask",
    name: "Shrine Mask",
    description: "Worn by the keepers of the inner sanctum.",
    rarity: "epic",
    cost: 1500,
    supply: 200,
    glyph: "◉",
    gradient: ["#f59e0b", "#0c0a09"],
  },
  {
    id: "eternal-flame",
    name: "Eternal Flame",
    description: "The first light. Mintable only by those who paid the price.",
    rarity: "legendary",
    cost: 5000,
    supply: 50,
    glyph: "▲",
    gradient: ["#fbbf24", "#450a0a"],
  },
];

export const RARITY_STYLES: Record<Rarity, { label: string; ring: string; text: string }> = {
  common:    { label: "common",    ring: "ring-ritual-border",  text: "text-ritual-muted" },
  rare:      { label: "rare",      ring: "ring-blue-500/40",    text: "text-blue-400" },
  epic:      { label: "epic",      ring: "ring-purple-500/40",  text: "text-purple-400" },
  legendary: { label: "legendary", ring: "ring-ritual-accent",  text: "text-ritual-accent" },
};

// Used in UI: contract reference shown on every NFT card
export const NFT_PAYMENT_TOKEN = SHRINE_TOKEN;