
# BaseGuard: Real-Time DeFi Trade Advisory Overlay

## The Problem
Retail crypto traders, especially in rapidly growing markets like India, often lose significant capital on Base chain due to **hidden slippage**, **low liquidity pools**, and **sandwich attacks**. They trade on popular DEXs like Uniswap without realizing their large orders are moving the price against them by 5-10% before the trade even lands.

## The Solution
**BaseGuard** is a browser extension overlay that injects a smart advisor into the existing DEX workflow. 
- **No Migration Required**: Users keep trading on Uniswap/PancakeSwap.
- **Deep Analysis**: Uses constant-product formulas to compute real-time price impact.
- **AI Powered**: Integrates Gemini 3.0 to explain risks in plain language.
- **Smart Sizing**: Automatically suggests splitting orders to preserve capital.

## Hackathon MVP Features
1. **Overlay UI**: A non-intrusive floating panel that activates during swaps.
2. **Liquidity Health Check**: Reads Base RPC data to determine pool depth.
3. **Execution Advisor**: Visual badges (Safe/Warning/Risky) based on impact.
4. **Gemini Insights**: Real-time risk assessment and defensive trading tips.

## Tech Stack
- **Frontend**: React + Tailwind CSS
- **Blockchain**: Base (Mainnet/Sepolia)
- **AI**: Google Gemini API (gemini-3-flash-preview)
- **Math**: Uniswap V2 constant product (x*y=k) logic
