import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

export const ritualTestnet = defineChain({
  id: 1979, // ⚠️ Replace with actual Ritual Testnet chain ID
  name: "CratD2C Testnet",
  nativeCurrency: { name: "Ritual", symbol: "RITUAL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ritualfoundation.org"] }, // replace with real RPC
  },
  blockExplorers: {
    default: { name: "RitualScan", url: "https://explorer.ritualfoundation.org" },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: "Shrine",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  chains: [ritualTestnet],
  ssr: true,
});