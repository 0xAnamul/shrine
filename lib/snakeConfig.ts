export const SNAKE_CONFIG = {
  GRID_SIZE: 20,        // 20x20 grid
  CELL_PX: 22,          // each cell = 22px
  TICK_MS: 110,         // game speed (lower = faster)
  POINTS_PER_FOOD: 10,  // in-game score per apple
  // Final game score is added 1:1 to global Shrine points
} as const;

export type Cell = { x: number; y: number };
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";