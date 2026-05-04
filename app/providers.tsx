"use client";
import React from "react";
import { RainbowKitProvider, getDefaultWallets, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { mainnet } from "wagmi/chains";

const queryClient = new QueryClient();

const { connectors } = getDefaultWallets({
  appName: "Shrine",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
});

const wagmiConfig = getDefaultConfig({
  appName: "Shrine",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
  chains: [mainnet],
  connectors,
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}