import { MOCK_POOL } from "./contracts";

export interface Quote {
  amountOut: number;
  priceImpactPct: number;
  feeAmount: number;
  minReceived: number;
  rate: number;
}

/**
 * Uniswap V2-style: amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
 */
export function getQuote(
  amountIn: number,
  reserveIn: number,
  reserveOut: number,
  slippageBps = 50 // 0.5%
): Quote {
  if (amountIn <= 0 || reserveIn <= 0 || reserveOut <= 0) {
    return { amountOut: 0, priceImpactPct: 0, feeAmount: 0, minReceived: 0, rate: 0 };
  }

  const feeBps = MOCK_POOL.feeBps;
  const amountInWithFee = amountIn * (10000 - feeBps);
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * 10000 + amountInWithFee;
  const amountOut = numerator / denominator;

  // Price impact: compare execution price vs spot price
  const spotPrice = reserveOut / reserveIn;
  const execPrice = amountOut / amountIn;
  const priceImpactPct = Math.max(0, (1 - execPrice / spotPrice) * 100);

  const feeAmount = (amountIn * feeBps) / 10000;
  const minReceived = amountOut * (1 - slippageBps / 10000);
  const rate = amountOut / amountIn;

  return { amountOut, priceImpactPct, feeAmount, minReceived, rate };
}