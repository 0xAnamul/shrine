import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PointsState {
  points: number;
  addPoints: (n: number) => void;
  spendPoints: (n: number) => boolean;
  reset: () => void;
}

export const usePoints = create<PointsState>()(
  persist(
    (set, get) => ({
      points: 0,
      addPoints: (n) => set({ points: get().points + n }),
      spendPoints: (n) => {
        if (get().points < n) return false;
        set({ points: get().points - n });
        return true;
      },
      reset: () => set({ points: 0 }),
    }),
    { name: "Shrine-points" }
  )
);