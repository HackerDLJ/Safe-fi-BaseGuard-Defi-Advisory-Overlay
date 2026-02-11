
import { PoolReserves, TradeAnalysis } from '../types';

/**
 * Uniswap V2 Constant Product Math (x * y = k)
 * Implementation for Price Impact and Slippage Calculation
 */

export const calculateTradeAnalysis = (
  inputAmount: number,
  reserves: PoolReserves,
  isToken0To1: boolean
): TradeAnalysis => {
  const x = isToken0To1 ? reserves.reserve0 : reserves.reserve1;
  const y = isToken0To1 ? reserves.reserve1 : reserves.reserve0;
  
  // Prevent division by zero
  if (x === 0) return getDefaultAnalysis(inputAmount);

  // Constant Product Formula: (x + deltaX) * (y - deltaY) = x * y
  const deltaX = inputAmount * (1 - reserves.fee); // Deduct fee first
  const deltaY = (y * deltaX) / (x + deltaX);
  
  const midPrice = y / x;
  const effectivePrice = deltaY / inputAmount;
  
  // Price Impact = (MidPrice - EffectivePrice) / MidPrice
  const priceImpact = Math.abs((midPrice - effectivePrice) / midPrice) * 100;
  
  // Basic slippage model (simplified for MVP)
  const slippage = priceImpact * 1.05; 

  let health: 'Safe' | 'Warning' | 'Risky' = 'Safe';
  let suggestedAction = "This trade looks efficient. Proceed with confidence.";
  let maxRecommendedSize = inputAmount;

  if (priceImpact > 5) {
    health = 'Risky';
    suggestedAction = `DANGER: Massive slippage. Execution is highly inefficient. Split into 5+ micro-orders of approx. ${(inputAmount / 5).toFixed(4)} each.`;
    maxRecommendedSize = x * 0.005; 
  } else if (priceImpact > 2) {
    health = 'Warning';
    suggestedAction = "Slippage threshold reached. Better execution possible if split into 2 separate transactions.";
    maxRecommendedSize = x * 0.015;
  }

  return {
    expectedOutput: deltaY,
    priceImpact,
    effectivePrice,
    midPrice,
    slippage,
    health,
    suggestedAction,
    maxRecommendedSize
  };
};

const getDefaultAnalysis = (amount: number): TradeAnalysis => ({
  expectedOutput: 0,
  priceImpact: 0,
  effectivePrice: 0,
  midPrice: 0,
  slippage: 0,
  health: 'Safe',
  suggestedAction: "Awaiting pool data...",
  maxRecommendedSize: amount
});

/**
 * Mock data to simulate Base RPC responses for Uniswap Pools.
 * Now enhanced with realistic price ratios, fee tiers, and temporal fluctuations.
 */
export const fetchPoolData = async (tokenA: string, tokenB: string): Promise<PoolReserves> => {
  if (tokenA === tokenB) return { reserve0: 1000000, reserve1: 1000000, fee: 0 };

  // Base prices in USD for more realistic ratios
  const PRICES: Record<string, number> = {
    "ETH": 2650,
    "WETH": 2650,
    "cbBTC": 63000,
    "WBTC": 63000,
    "USDC": 1,
    "USDbC": 1,
    "DAI": 1,
    "AERO": 0.85,
    "DEGEN": 0.008,
    "VIRTUAL": 0.45,
    "PEPE": 0.000009,
    "TOSHI": 0.0002,
    "KEYCAT": 0.005,
    "MOXIE": 0.012,
    "HIGHER": 0.03,
    "FUEGO": 0.12
  };

  const getPrice = (t: string) => PRICES[t] || 1;
  const isStable = (t: string) => ['USDC', 'USDbC', 'DAI'].includes(t);
  const isMajor = (t: string) => ['ETH', 'WETH', 'cbBTC', 'WBTC', ...Object.keys(PRICES).filter(isStable)].includes(t);

  // Fee Tier simulation (Uniswap V3 style)
  let fee = 0.003; // Standard 0.3%
  if (isStable(tokenA) && isStable(tokenB)) fee = 0.0001; // 0.01% for stable pairs
  else if (isMajor(tokenA) && isMajor(tokenB)) fee = 0.0005; // 0.05% for blue chips
  else if (!isMajor(tokenA) || !isMajor(tokenB)) fee = 0.01; // 1% for exotics/memes

  // Seed for determinism
  const getSeed = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
  const poolSeed = Math.abs(getSeed(tokenA + tokenB));
  
  // Liquidity Depth
  let baseReserveUSD = 50000; // Small pool
  if (isMajor(tokenA) && isMajor(tokenB)) baseReserveUSD = 10000000; // Deep major pool
  else if (isMajor(tokenA) || isMajor(tokenB)) baseReserveUSD = 500000; // Mid pool
  
  // Add some temporal fluctuation (changes every 10 seconds)
  const timeMod = Math.sin(Date.now() / 10000) * 0.02; // +/- 2% fluctuation
  const fluctuation = 1 + (poolSeed % 10 / 100) + timeMod;
  
  const totalLiquidity = baseReserveUSD * fluctuation;
  
  // Calculate reserves based on price ratio (Price A * Reserve A = Price B * Reserve B)
  // Reserve A = TotalLiquidity / Price A
  // Reserve B = TotalLiquidity / Price B
  const reserve0 = totalLiquidity / getPrice(tokenA);
  const reserve1 = totalLiquidity / getPrice(tokenB);

  return { reserve0, reserve1, fee };
};
