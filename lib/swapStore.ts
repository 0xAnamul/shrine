import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_POOL } from "./contracts";

interface SwapState {
  // Pool reserves (mutate on swaps)
  ritualReserve: number;
  shrineReserve: number;

  // User mock balances (faucet starts at 1000 RITUAL, 0 SHRINE)
  balances: { RITUAL: number; SHRINE: number };

  // Swap history
  history: Array<{
    id: string;
    from: "RITUAL" | "SHRINE";
    to: "RITUAL" | "SHRINE";
    amountIn: number;
    amountOut: number;
    txHash: string;
    timestamp: number;
  }>;

  swap: (
    from: "RITUAL" | "SHRINE",
    to: "RITUAL" | "SHRINE",
    amountIn: number,
    amountOut: number
  ) => string; // returns mock tx hash

  faucet: () => void;
  reset: () => void;
}

const fakeTxHash = () =>
  "0x" + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)).join("");

export const useSwapStore = create<SwapState>()(
  persist(
    (set, get) => ({
      ritualReserve: MOCK_POOL.ritualReserve,
      shrineReserve: MOCK_POOL.shrineReserve,
      balances: { RITUAL: 1000, SHRINE: 0 },
      history: [],

      swap: (from, to, amountIn, amountOut) => {
        const s = get();
        const txHash = fakeTxHash();

        // Update reserves (AMM)
        let newRitual = s.ritualReserve;
        let newShrine = s.shrineReserve;
        if (from === "RITUAL") {
          newRitual += amountIn;
          newShrine -= amountOut;
        } else {
          newShrine += amountIn;
          newRitual -= amountOut;
        }

        // Update user balances
        const newBalances = { ...s.balances };
        newBalances[from] -= amountIn;
        newBalances[to] += amountOut;

        set({
          ritualReserve: newRitual,
          shrineReserve: newShrine,
          balances: newBalances,
          history: [
            { id: txHash, from, to, amountIn, amountOut,
              txHash, timestamp: Date.now() },
            ...s.history,
          ].slice(0, 10),
        });

        return txHash;
      },

      faucet: () =>
        set((s) => ({
          balances: {
            RITUAL: s.balances.RITUAL + 1000,
            SHRINE: s.balances.SHRINE,
          },
        })),

      reset: () =>
        set({
          ritualReserve: MOCK_POOL.ritualReserve,
          shrineReserve: MOCK_POOL.shrineReserve,
          balances: { RITUAL: 1000, SHRINE: 0 },
          history: [],
        }),
    }),
    { name: "shrine-swap-store" }
  )
);