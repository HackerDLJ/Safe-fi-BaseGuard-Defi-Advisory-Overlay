
# Safe-fi: BaseGurd On-Chain Trade Advisory & Protection

## Short summary
Safe‑Fi is a real‑time DeFi trade‑advisory overlay on Base that analyzes swaps before execution, warns users of high slippage, and suggests safer trade sizes.

## Screenshots
<img width="1092" height="657" alt="Screenshot 2026-02-12 at 12 20 21 PM" src="https://github.com/user-attachments/assets/dfc23e59-44f7-4826-9a9c-b95f30045862" />
<img width="1092" height="657" alt="Screenshot 2026-02-12 at 12 20 38 PM" src="https://github.com/user-attachments/assets/29b6cc42-15ac-4c71-a9fa-c8cb011761ff" />

## Video

https://github.com/user-attachments/assets/b637e3d1-fda2-4db8-aac2-c28a2213a08b



## Full project description
### Problem it solves
Retail crypto traders on Base (especially beginners) often lose money because they don’t understand slippage, liquidity depth, or price impact. They execute large trades on low‑liquidity pools, causing bad fills and poor PnL, without realizing why. Safe‑Fi solves this by acting as a non‑custodial, advisory overlay that sits on top of existing DEXs (like Uniswap on Base) and gives instant, plain‑language feedback before a swap is confirmed.

## How the technology was used
### Safe‑Fi uses 
	•	Base blockchain RPC to read pool reserves from Uniswap‑style pools.
	•	A Node.js backend that computes price impact, slippage, and liquidity health for any given trade.
	•	A frontend (web or browser extension) that connects the user’s wallet to Base, lets them input a trade, and displays a simple risk badge plus suggested max trade size.
This lets users keep trading on familiar platforms while getting expert‑level risk signals in real time, without changing their workflow.

## Getting Started
- Open `index.html` to view the **Tactical Simulation**.
- Switch token pairs (e.g., PEPE/USDC) to see the `Risky` alert triggered by low-liquidity simulation.
- Increase input amount (e.g., 50 ETH) to see the Price Impact HUD respond in real-time.
