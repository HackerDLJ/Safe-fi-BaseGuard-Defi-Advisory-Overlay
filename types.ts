
export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
}

export interface PoolReserves {
  reserve0: number; // Token A
  reserve1: number; // Token B
  fee: number;
}

export interface TradeAnalysis {
  expectedOutput: number;
  priceImpact: number;
  effectivePrice: number;
  midPrice: number;
  slippage: number;
  health: 'Safe' | 'Warning' | 'Risky';
  suggestedAction: string;
  maxRecommendedSize: number;
}

export interface BetterPoolOption {
  poolAddress: string;
  reserves: PoolReserves;
  projectedImpact: number;
}
