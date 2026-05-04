"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { SNAKE_CONFIG, type Cell, type Direction } from "@/lib/snakeConfig";
import { usePoints } from "@/lib/store";
import { useAccount } from "wagmi";
import { Play, Pause, RotateCcw, Trophy, Sparkles } from "lucide-react";

const { GRID_SIZE, CELL_PX, TICK_MS, POINTS_PER_FOOD } = SNAKE_CONFIG;
const CANVAS_PX = GRID_SIZE * CELL_PX;

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
};

const initialSnake = (): Cell[] => [
  { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 },
];

const randomFood = (snake: Cell[]): Cell => {
  while (true) {
    const f = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f;
  }
};

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isConnected } = useAccount();
  const addPoints = usePoints((s) => s.addPoints);

  const [snake, setSnake] = useState<Cell[]>(initialSnake);
  const [food, setFood] = useState<Cell>(() => randomFood(initialSnake()));
  const [dir, setDir] = useState<Direction>("RIGHT");
  const [queuedDir, setQueuedDir] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [synced, setSynced] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Load high score
  useEffect(() => {
    const hs = Number(localStorage.getItem("shrine-snake-hs") ?? "0");
    setHighScore(hs);
  }, []);

  // Keyboard input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP", ArrowDown: "DOWN",
        ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      // prevent reversing into self
      if (next !== OPPOSITE[dir]) setQueuedDir(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dir]);

  // Game tick
  useEffect(() => {
    if (!running || gameOver) return;
    const id = setInterval(() => {
      setDir(queuedDir);
      setSnake((prev) => {
        const head = prev[0];
        const delta = {
          UP: { x: 0, y: -1 }, DOWN: { x: 0, y: 1 },
          LEFT: { x: -1, y: 0 }, RIGHT: { x: 1, y: 0 },
        }[queuedDir];

        const newHead = { x: head.x + delta.x, y: head.y + delta.y };

        // Wall collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        // Self collision
        if (prev.some((c) => c.x === newHead.x && c.y === newHead.y)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        const ate = newHead.x === food.x && newHead.y === food.y;
        const next = [newHead, ...prev];
        if (ate) {
          setScore((s) => s + POINTS_PER_FOOD);
          setFood(randomFood(next));
        } else {
          next.pop();
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, gameOver, queuedDir, food]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // bg
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, CANVAS_PX, CANVAS_PX);

    // grid dots
    ctx.fillStyle = "#1a1a1a";
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        ctx.fillRect(x * CELL_PX + CELL_PX / 2 - 1, y * CELL_PX + CELL_PX / 2 - 1, 2, 2);
      }
    }

    // food (amber glow)
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_PX + CELL_PX / 2,
      food.y * CELL_PX + CELL_PX / 2,
      CELL_PX / 2 - 3, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // snake
    snake.forEach((c, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? "#ededed" : "#a3a3a3";
      ctx.fillRect(
        c.x * CELL_PX + 2,
        c.y * CELL_PX + 2,
        CELL_PX - 4, CELL_PX - 4
      );
    });
  }, [snake, food]);

  // Sync score to global points on game over
  useEffect(() => {
    if (gameOver && !synced && score > 0) {
      addPoints(score);
      setSynced(true);
      if (score > highScore) {
        localStorage.setItem("shrine-snake-hs", String(score));
        setHighScore(score);
      }
    }
  }, [gameOver, synced, score, addPoints, highScore]);

  const reset = useCallback(() => {
    const s = initialSnake();
    setSnake(s);
    setFood(randomFood(s));
    setDir("RIGHT");
    setQueuedDir("RIGHT");
    setScore(0);
    setGameOver(false);
    setSynced(false);
    setRunning(false);
  }, []);

  const start = () => {
    if (gameOver) reset();
    setRunning(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stats bar */}
      <div className="w-full flex items-center justify-between gap-3 text-sm font-mono">
        <Stat label="score" value={score} icon={<Sparkles size={14} />} />
        <Stat label="best" value={highScore} icon={<Trophy size={14} />} />
        <Stat label="length" value={snake.length} />
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl border border-ritual-border bg-ritual-surface p-3">
        <canvas
          ref={canvasRef}
          width={CANVAS_PX}
          height={CANVAS_PX}
          className="rounded-lg"
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center
                          bg-ritual-bg/85 backdrop-blur-sm rounded-xl">
            <p className="text-2xl font-mono mb-1">game over</p>
            <p className="text-ritual-muted text-sm mb-4">
              final score: <span className="text-ritual-accent">{score}</span>
            </p>
            {synced && (
              <p className="text-xs text-ritual-success mb-4">
                ✓ +{score} synced to your shrine points
              </p>
            )}
            <button onClick={reset}
              className="px-4 py-2 rounded-lg bg-ritual-accent text-black
                         font-semibold hover:opacity-90 transition">
              play again
            </button>
          </div>
        )}
        {!running && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center
                          bg-ritual-bg/60 backdrop-blur-sm rounded-xl">
            <button onClick={start}
              className="flex items-center gap-2 px-6 py-3 rounded-lg
                         bg-ritual-accent text-black font-semibold hover:opacity-90">
              <Play size={18} /> start
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {running ? (
          <button onClick={() => setRunning(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-ritual-border hover:border-ritual-accent">
            <Pause size={14} /> pause
          </button>
        ) : (
          <button onClick={start}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-ritual-border hover:border-ritual-accent">
            <Play size={14} /> {gameOver ? "restart" : "resume"}
          </button>
        )}
        <button onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     border border-ritual-border hover:border-ritual-accent">
          <RotateCcw size={14} /> reset
        </button>
      </div>

      {/* Hints */}
      <div className="text-center text-xs text-ritual-muted space-y-1">
        <p>arrow keys or WASD to move</p>
        {!isConnected && (
          <p className="text-ritual-accent">
            connect wallet to persist points across sessions
          </p>
        )}
      </div>

      {/* Mobile D-Pad */}
      <MobilePad onMove={(d) => d !== OPPOSITE[dir] && setQueuedDir(d)} />
    </div>
  );
}

function Stat({ label, value, icon }:
  { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg
                    border border-ritual-border bg-ritual-surface flex-1 justify-center">
      {icon && <span className="text-ritual-accent">{icon}</span>}
      <span className="text-ritual-muted">{label}</span>
      <span className="text-ritual-fg font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function MobilePad({ onMove }: { onMove: (d: Direction) => void }) {
  const Btn = ({ d, label }: { d: Direction; label: string }) => (
    <button onClick={() => onMove(d)}
      className="w-14 h-14 rounded-lg border border-ritual-border
                 bg-ritual-surface hover:border-ritual-accent
                 active:bg-ritual-accent active:text-black
                 font-mono text-lg">
      {label}
    </button>
  );
  return (
    <div className="md:hidden grid grid-cols-3 gap-2 w-fit">
      <div /> <Btn d="UP" label="↑" /> <div />
      <Btn d="LEFT" label="←" />
      <div className="w-14 h-14" />
      <Btn d="RIGHT" label="→" />
      <div /> <Btn d="DOWN" label="↓" /> <div />
    </div>
  );
}