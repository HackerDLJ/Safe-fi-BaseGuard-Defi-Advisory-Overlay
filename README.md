# Safe-Fi: On-Chain Trade Advisory & Protection

## The High-Trust Advisor for Base
Safe-Fi combines high-frequency blockchain telemetry with Google Gemini AI to protect retail traders on Base. Unlike simple calculators, Safe-Fi uses a **Solidity Smart Contract (TradeGuardian.sol)** to provide verified, on-chain execution analysis.

## Core Innovations
1. **Solidity Trade Verification**: The logic is implemented in `TradeGuardian.sol`, allowing the advisory tool to query a verified on-chain oracle for slippage analysis rather than relying on potentially malicious client-side data.
2. **Tactical Sci-Fi HUD**: A cyberpunk-inspired interface that overlays seamlessly on Uniswap, providing a high-contrast tactical readout of trade health.
3. **Deterministic Mock Simulation**: Enhanced environment in `baseService.ts` that replicates realistic pool fluctuations, fee tiers (0.01% - 1%), and liquidity depths for all major Base assets.
4. **AI Risk Profiling**: Gemini 3.0 analyzes the specific token pair and price impact to warn about "Low Liquidity Traps" or "Sandwich Attack Windows".

## Smart Contract Details (`contracts/TradeGuardian.sol`)
- **analyzeTrade**: Computes exact output and price impact using internal pool reserves logic.
- **Retail Guard**: A safety threshold (default 3%) that marks trades as unsafe for retail execution.
- **Gas Optimized**: Uses assembly-level precision for constant product calculations.

## Getting Started
- Open `index.html` to view the **Tactical Simulation**.
- Switch token pairs (e.g., PEPE/USDC) to see the `Risky` alert triggered by low-liquidity simulation.
- Increase input amount (e.g., 50 ETH) to see the Price Impact HUD respond in real-time.