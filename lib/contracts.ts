export const SHRINE_TOKEN = {
  address: "0x4A037f7F10299C8dE3a07eeC684d3eEF8EeA6F7d" as const,
  symbol: "SHRINE",
  decimals: 18,
  verified: true, // ✅ shows blue checkmark in UI
} as const;

export const RITUAL_NFT = {
  address: "0x0000000000000000000000000000000000000000" as const, // deploy & paste
} as const;

// Standard ERC20 ABI subset
export const erc20Abi = [
  { name: "balanceOf", type: "function", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }] },
  { name: "transfer", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }] },
] as const;
export const SHRINE_TOKEN = {
  address: "0x4A037f7F10299C8dE3a07eeC684d3eEF8EeA6F7d" as const,
  symbol: "SHRINE",
  name: "Shrine Token",
  decimals: 18,
  verified: true,
  logo: "🔥",
} as const;

export const RITUAL_TOKEN = {
  address: "0x0000000000000000000000000000000000000000" as const, // native
  symbol: "RITUAL",
  name: "Ritual",
  decimals: 18,
  verified: true,
  logo: "▲",
} as const;

export const TOKEN_LIST = [RITUAL_TOKEN, SHRINE_TOKEN] as const;
export type Token = typeof TOKEN_LIST[number];

// Mock pool reserves (constant product AMM: x * y = k)
export const MOCK_POOL = {
  ritualReserve: 1_000_000,
  shrineReserve: 5_000_000, // 1 RITUAL ≈ 5 SHRINE
  feeBps: 30,               // 0.3% swap fee
} as const;

export const SWAP_REWARD_POINTS = 100;

export const erc20Abi = [
  { name: "balanceOf", type: "function", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }] },
] as const;