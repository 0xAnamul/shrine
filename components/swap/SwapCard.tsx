"use client";
import { useState, useMemo, useEffect } from "react";
import { useAccount } from "wagmi";
import { ArrowDown, Settings, Sparkles, Loader2, BadgeCheck, ExternalLink, Droplet } from "lucide-react";
import { TokenSelect } from "./TokenSelect";
import { SHRINE_TOKEN, RITUAL_TOKEN, SWAP_REWARD_POINTS, type Token } from "@/lib/contracts";
import { getQuote } from "@/lib/swapMath";
import { useSwapStore } from "@/lib/swapStore";
import { usePoints } from "@/lib/store";

type TxState =
  | { status: "idle" }
  | { status: "confirming" }
  | { status: "success"; hash: string; pointsAwarded: number }
  | { status: "error"; message: string };

export function SwapCard() {
  const { isConnected } = useAccount();
  const addPoints = usePoints((s) => s.addPoints);

  const { ritualReserve, shrineReserve, balances, swap, faucet } = useSwapStore();

  const [fromToken, setFromToken] = useState<Token>(RITUAL_TOKEN);
  const [toToken, setToToken] = useState<Token>(SHRINE_TOKEN);
  const [amountIn, setAmountIn] = useState("");
  const [slippageBps, setSlippageBps] = useState(50); // 0.5%
  const [showSettings, setShowSettings] = useState(false);
  const [tx, setTx] = useState<TxState>({ status: "idle" });

  const reserveIn = fromToken.symbol === "RITUAL" ? ritualReserve : shrineReserve;
  const reserveOut = toToken.symbol === "RITUAL" ? ritualReserve : shrineReserve;
  const userBalance = balances[fromToken.symbol as "RITUAL" | "SHRINE"];

  const quote = useMemo(
    () => getQuote(parseFloat(amountIn) || 0, reserveIn, reserveOut, slippageBps),
    [amountIn, reserveIn, reserveOut, slippageBps]
  );

  const flip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmountIn("");
  };

  const setMax = () => setAmountIn(String(userBalance));

  const numericAmount = parseFloat(amountIn) || 0;
  const insufficientBalance = numericAmount > userBalance;
  const insufficientLiquidity = quote.amountOut >= reserveOut;
  const canSwap =
    isConnected &&
    numericAmount > 0 &&
    !insufficientBalance &&
    !insufficientLiquidity &&
    tx.status === "idle";

  const handleSwap = async () => {
    if (!canSwap) return;
    setTx({ status: "confirming" });

    // Simulate network confirmation delay (1.5s)
    await new Promise((r) => setTimeout(r, 1500));

    try {
      const hash = swap(
        fromToken.symbol as "RITUAL" | "SHRINE",
        toToken.symbol as "RITUAL" | "SHRINE",
        numericAmount,
        quote.amountOut
      );

      // 🎁 Reward: +100 points per successful swap
      addPoints(SWAP_REWARD_POINTS);

      setTx({ status: "success", hash, pointsAwarded: SWAP_REWARD_POINTS });
      setAmountIn("");
    } catch (e: any) {
      setTx({ status: "error", message: e.message ?? "Swap failed" });
    }
  };

  // Auto-dismiss success after 6s
  useEffect(() => {
    if (tx.status === "success" || tx.status === "error") {
      const t = setTimeout(() => setTx({ status: "idle" }), 6000);
      return () => clearTimeout(t);
    }
  }, [tx.status]);

  const buttonLabel = !isConnected
    ? "connect wallet"
    : numericAmount === 0
    ? "enter an amount"
    : insufficientBalance
    ? `insufficient ${fromToken.symbol}`
    : insufficientLiquidity
    ? "insufficient liquidity"
    : tx.status === "confirming"
    ? "confirming…"
    : "swap";

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Card */}
      <div className="rounded-2xl border border-ritual-border bg-ritual-surface p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="font-mono text-sm">swap</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={faucet}
              title="Get 1000 mock RITUAL"
              className="p-1.5 rounded-lg hover:bg-ritual-bg text-ritual-muted hover:text-ritual-accent"
            >
              <Droplet size={14} />
            </button>
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="p-1.5 rounded-lg hover:bg-ritual-bg text-ritual-muted hover:text-ritual-fg"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Slippage settings */}
        {showSettings && (
          <div className="rounded-lg border border-ritual-border bg-ritual-bg p-3 space-y-2">
            <p className="text-xs text-ritual-muted">slippage tolerance</p>
            <div className="flex gap-2">
              {[10, 50, 100].map((bps) => (
                <button
                  key={bps}
                  onClick={() => setSlippageBps(bps)}
                  className={`px-3 py-1 rounded text-xs border ${
                    slippageBps === bps
                      ? "border-ritual-accent text-ritual-accent"
                      : "border-ritual-border text-ritual-muted"
                  }`}
                >
                  {(bps / 100).toFixed(2)}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* From */}
        <TokenInputRow
          label="you pay"
          token={fromToken}
          amount={amountIn}
          onAmountChange={setAmountIn}
          balance={userBalance}
          onMax={setMax}
          onSelect={(t) => {
            if (t.symbol === toToken.symbol) setToToken(fromToken);
            setFromToken(t);
          }}
          disabledSymbol={toToken.symbol}
        />

        {/* Flip */}
        <div className="flex justify-center -my-1">
          <button
            onClick={flip}
            className="p-1.5 rounded-lg border border-ritual-border bg-ritual-surface
                       hover:border-ritual-accent hover:text-ritual-accent transition z-10"
          >
            <ArrowDown size={14} />
          </button>
        </div>

        {/* To */}
        <TokenInputRow
          label="you receive"
          token={toToken}
          amount={quote.amountOut > 0 ? quote.amountOut.toFixed(6) : ""}
          readOnly
          balance={balances[toToken.symbol as "RITUAL" | "SHRINE"]}
          onSelect={(t) => {
            if (t.symbol === fromToken.symbol) setFromToken(toToken);
            setToToken(t);
          }}
          disabledSymbol={fromToken.symbol}
        />

        {/* Quote info */}
        {numericAmount > 0 && (
          <div className="rounded-lg bg-ritual-bg border border-ritual-border p-3 space-y-1.5 text-xs font-mono">
            <Row label="rate"
              value={`1 ${fromToken.symbol} = ${quote.rate.toFixed(4)} ${toToken.symbol}`} />
            <Row label="price impact"
              value={`${quote.priceImpactPct.toFixed(2)}%`}
              accent={quote.priceImpactPct > 5 ? "warn" : undefined} />
            <Row label="fee (0.30%)"
              value={`${quote.feeAmount.toFixed(4)} ${fromToken.symbol}`} />
            <Row label="min received"
              value={`${quote.minReceived.toFixed(6)} ${toToken.symbol}`} />
            <Row
              label="reward"
              value={
                <span className="flex items-center gap-1 text-ritual-accent">
                  <Sparkles size={11} /> +{SWAP_REWARD_POINTS} points
                </span>
              }
            />
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleSwap}
          disabled={!canSwap}
          className="w-full py-3 rounded-xl font-semibold transition
                     bg-ritual-accent text-black hover:opacity-90
                     disabled:bg-ritual-border disabled:text-ritual-muted
                     disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {tx.status === "confirming" && <Loader2 size={16} className="animate-spin" />}
          {buttonLabel}
        </button>
      </div>

      {/* Tx toast */}
      {tx.status === "success" && (
        <div className="rounded-xl border border-ritual-success/40 bg-ritual-success/10 p-3 text-sm space-y-1">
          <div className="flex items-center gap-2 text-ritual-success font-mono">
            <BadgeCheck size={16} /> swap confirmed
          </div>
          <div className="flex items-center justify-between text-xs text-ritual-muted">
            <span>+{tx.pointsAwarded} points awarded</span>
            <a
              href={`https://testnet-explorer.ritual.net/tx/${tx.hash}`}
              target="_blank"
              className="flex items-center gap-1 hover:text-ritual-accent"
            >
              {tx.hash.slice(0, 6)}…{tx.hash.slice(-4)} <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}
      {tx.status === "error" && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {tx.message}
        </div>
      )}
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function TokenInputRow({
  label, token, amount, onAmountChange, balance, onMax,
  readOnly, onSelect, disabledSymbol,
}: {
  label: string;
  token: Token;
  amount: string;
  onAmountChange?: (v: string) => void;
  balance: number;
  onMax?: () => void;
  readOnly?: boolean;
  onSelect: (t: Token) => void;
  disabledSymbol?: string;
}) {
  return (
    <div className="rounded-xl bg-ritual-bg border border-ritual-border p-3 space-y-2">
      <div className="flex items-center justify-between text-xs text-ritual-muted">
        <span>{label}</span>
        <span>
          balance:{" "}
          <span className="text-ritual-fg tabular-nums">{balance.toFixed(2)}</span>
          {onMax && balance > 0 && (
            <button
              onClick={onMax}
              className="ml-2 text-ritual-accent hover:underline"
            >
              max
            </button>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none text-2xl font-mono
                     placeholder:text-ritual-border tabular-nums"
        />
        <TokenSelect
          selected={token}
          onSelect={onSelect}
          disabledSymbol={disabledSymbol}
        />
      </div>
    </div>
  );
}

function Row({
  label, value, accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "warn";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ritual-muted">{label}</span>
      <span className={accent === "warn" ? "text-yellow-400" : "text-ritual-fg"}>
        {value}
      </span>
    </div>
  );
}