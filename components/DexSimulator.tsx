
import React, { useState, useEffect } from 'react';
import { fetchPoolData, calculateTradeAnalysis } from '../services/baseService';
import { TradeAnalysis } from '../types';
import AdvisoryOverlay from './AdvisoryOverlay';

const TOKEN_LIST = [
  "ETH", "WETH", "cbBTC", "WBTC", "USDC", "USDbC", "DAI", 
  "AERO", "DEGEN", "VIRTUAL", "PEPE", "TOSHI", "KEYCAT", 
  "MOXIE", "HIGHER", "FUEGO"
];

const DexSimulator: React.FC = () => {
  const [inputAmount, setInputAmount] = useState<string>("1.0");
  const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null);
  const [tokenA, setTokenA] = useState("ETH");
  const [tokenB, setTokenB] = useState("USDC");

  useEffect(() => {
    const update = async () => {
      const amount = parseFloat(inputAmount);
      if (isNaN(amount) || amount <= 0) {
        setAnalysis(null);
        return;
      }
      
      const reserves = await fetchPoolData(tokenA, tokenB);
      // Determine direction for mock (most alts priced against ETH or USDC)
      const isToken0To1 = true; 
      const result = calculateTradeAnalysis(amount, reserves, isToken0To1);
      setAnalysis(result);
    };

    const timer = setTimeout(update, 300);
    return () => clearTimeout(timer);
  }, [inputAmount, tokenA, tokenB]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* HUD Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
         <div className="absolute top-1/4 left-1/4 w-1 h-32 bg-amber-500/20 blur-sm" />
         <div className="absolute top-1/2 right-1/4 w-32 h-1 bg-amber-500/20 blur-sm" />
         <div className="absolute bottom-1/4 left-1/2 w-48 h-0.5 bg-amber-500/10" />
      </div>

      <div className="z-10 w-full max-w-md relative">
        {/* Decorative HUD Corners */}
        <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500/60 rounded-tl-lg pointer-events-none" />
        <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/60 rounded-tr-lg pointer-events-none" />
        <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/60 rounded-bl-lg pointer-events-none" />
        <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500/60 rounded-br-lg pointer-events-none" />

        <div className="glass rounded-2xl shadow-2xl overflow-hidden yellow-glow border border-amber-500/30">
          {/* Header */}
          <div className="p-6 border-b border-amber-500/20 flex items-center justify-between bg-amber-500/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <h1 className="text-sm font-black text-amber-500 tracking-[0.3em] uppercase mono">Base_Guardian</h1>
              </div>
              <p className="text-[10px] text-amber-500/40 mono uppercase tracking-widest">Protocol_V3.0 // Active_Watch</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] mono text-amber-500/60">GAS: 0.01 GWEI</span>
              <span className="text-[9px] mono text-emerald-400">STATUS: SYNCED</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Input Panel (Sell) */}
            <div className="bg-black/60 rounded-xl p-5 border border-amber-500/10 hover:border-amber-500/40 transition-all group">
              <div className="flex justify-between text-[10px] text-amber-500/40 font-bold mb-3 mono tracking-widest">
                <span className="group-hover:text-amber-500 transition-colors uppercase">Payload_Input [Sell]</span>
                <span>BAL: 1,337.00</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="bg-transparent text-4xl font-bold outline-none w-full text-white mono placeholder-white/10"
                  placeholder="0.00"
                />
                <select 
                  value={tokenA}
                  onChange={(e) => setTokenA(e.target.value)}
                  className="bg-black border border-amber-500/40 text-amber-400 rounded-lg px-4 py-2 text-xs font-black outline-none mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer appearance-none text-center min-w-[100px]"
                >
                  {TOKEN_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Vertical Splitter / Flip Icon */}
            <div className="flex justify-center -my-5 relative z-10">
              <div 
                onClick={() => { const tmp = tokenA; setTokenA(tokenB); setTokenB(tmp); }}
                className="w-10 h-10 bg-black border border-amber-500/40 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center text-amber-500 hover:rotate-180 transition-all duration-500 cursor-pointer hover:bg-amber-500 hover:text-black hover:shadow-amber-500/50"
              >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            </div>

            {/* Output Panel (Buy) */}
            <div className="bg-black/60 rounded-xl p-5 border border-amber-500/10">
              <div className="flex justify-between text-[10px] text-amber-500/40 font-bold mb-3 mono tracking-widest uppercase">
                <span>Expected_Receipt [Buy]</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-amber-500/30 w-full overflow-hidden truncate mono">
                  {analysis ? analysis.expectedOutput.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0.000000'}
                </div>
                <select 
                  value={tokenB}
                  onChange={(e) => setTokenB(e.target.value)}
                  className="bg-black border border-amber-500/40 text-amber-400 rounded-lg px-4 py-2 text-xs font-black outline-none mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer appearance-none text-center min-w-[100px]"
                >
                  {TOKEN_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-4 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:brightness-125 text-black font-black py-5 rounded-xl transition-all active:scale-95 shadow-[0_0_25px_rgba(245,158,11,0.3)] uppercase tracking-[0.3em] text-sm mono">
              Initiate_Transaction
            </button>
          </div>

          {/* Statistics Bar */}
          {analysis && (
            <div className="px-6 py-4 bg-amber-500/10 border-t border-amber-500/20 grid grid-cols-2 gap-4 text-[10px] mono">
              <div className="space-y-1">
                <p className="text-amber-500/40 uppercase tracking-tighter">Market_Rate</p>
                <p className="text-amber-300 font-bold truncate">1 {tokenA} = {analysis.midPrice.toLocaleString()} {tokenB}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-amber-500/40 uppercase tracking-tighter">Impact_Safety</p>
                <p className={analysis.priceImpact > 1 ? 'text-red-400 font-black animate-pulse' : 'text-emerald-400 font-bold'}>
                  {analysis.priceImpact.toFixed(4)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 max-w-xs text-center">
        <div className="flex justify-center gap-3 mb-2 opacity-20">
          <div className="w-1 h-1 bg-amber-500 rounded-full" />
          <div className="w-1 h-1 bg-amber-500 rounded-full" />
          <div className="w-1 h-1 bg-amber-500 rounded-full" />
        </div>
        <p className="text-amber-500/20 text-[9px] font-bold mono uppercase tracking-[0.4em]">
          End_To_End_Encrypted_Link
        </p>
      </div>

      <AdvisoryOverlay analysis={analysis} pair={`${tokenA}/${tokenB}`} />
    </div>
  );
};

export default DexSimulator;
