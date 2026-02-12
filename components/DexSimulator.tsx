import React, { useState, useEffect } from 'react';
import { fetchPoolData, calculateTradeAnalysis } from '../services/baseService';
import { TradeAnalysis } from '../types';
import AdvisoryOverlay from './AdvisoryOverlay';
import ContractAuditor from './ContractAuditor';

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
  const [blockHeight, setBlockHeight] = useState(19234850);

  useEffect(() => {
    const update = async () => {
      const amount = parseFloat(inputAmount);
      if (isNaN(amount) || amount <= 0) {
        setAnalysis(null);
        return;
      }
      
      const reserves = await fetchPoolData(tokenA, tokenB);
      const isToken0To1 = true; 
      const result = calculateTradeAnalysis(amount, reserves, isToken0To1);
      setAnalysis(result);
    };

    const timer = setTimeout(update, 300);
    const blockTimer = setInterval(() => setBlockHeight(h => h + 1), 2000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(blockTimer);
    };
  }, [inputAmount, tokenA, tokenB]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <div className="z-10 w-full max-w-md relative">
        {/* Tactical HUD Header */}
        <div className="flex justify-between items-end mb-3 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-amber-400 rounded-sm rotate-45 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <span className="text-[10px] font-black text-amber-400/80 mono tracking-widest uppercase gold-text-glow">Node_Status</span>
            </div>
            <div className="text-[11px] font-bold text-amber-500 mono">BLOCK: {blockHeight}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-bold text-amber-500/50 mono uppercase tracking-tighter">Network_Latency</div>
            <div className="text-[11px] font-bold text-emerald-400 mono shadow-emerald-400/20">12ms (OPTIMAL)</div>
          </div>
        </div>

        {/* Main DEX Console */}
        <div className="glass rounded-2xl shadow-2xl overflow-hidden yellow-glow border border-amber-500/40">
          <div className="p-6 border-b border-amber-500/30 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_#fbbf24]" />
                <h1 className="text-sm font-black text-amber-400 tracking-[0.4em] uppercase mono gold-text-glow">Base_Guardian</h1>
              </div>
              <p className="text-[10px] text-amber-500/60 mono uppercase tracking-widest">Verified_By_TradeGuardian.sol</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] mono text-amber-500/80 font-bold">GAS: 0.01 GWEI</span>
              <span className="text-[9px] mono text-emerald-400 uppercase tracking-tighter">Sec_Channel: Active</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Input Panel */}
            <div className="bg-black/60 rounded-xl p-5 border border-amber-500/20 hover:border-amber-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
              <div className="flex justify-between text-[10px] text-amber-500/60 font-bold mb-3 mono tracking-widest uppercase">
                <span>Payload_Input [Sell]</span>
                <span className="text-amber-400/80">BAL: 1,337.00</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="bg-transparent text-4xl font-bold outline-none w-full text-white mono placeholder-white/5"
                  placeholder="0.00"
                />
                <select 
                  value={tokenA}
                  onChange={(e) => setTokenA(e.target.value)}
                  className="bg-black border-2 border-amber-500/40 text-amber-400 rounded-lg px-3 py-2 text-xs font-black outline-none mono cursor-pointer text-center min-w-[100px] hover:border-amber-400 transition-colors"
                >
                  {TOKEN_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Flip Icon */}
            <div className="flex justify-center -my-6 relative z-10">
              <button 
                onClick={() => { const tmp = tokenA; setTokenA(tokenB); setTokenB(tmp); }}
                className="w-12 h-12 bg-black border-2 border-amber-500/50 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center text-amber-500 hover:rotate-180 transition-all duration-700 cursor-pointer hover:bg-amber-500 hover:text-black hover:shadow-amber-500/60 group"
              >
                 <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                 </svg>
              </button>
            </div>

            {/* Output Panel */}
            <div className="bg-black/60 rounded-xl p-5 border border-amber-500/20 relative overflow-hidden">
               <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
              <div className="flex justify-between text-[10px] text-amber-500/60 font-bold mb-3 mono tracking-widest uppercase">
                <span>Expected_Receipt [Buy]</span>
                <span className="text-emerald-500/50 animate-pulse">Computing...</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-amber-500/40 w-full overflow-hidden truncate mono gold-text-glow">
                  {analysis ? analysis.expectedOutput.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0.000000'}
                </div>
                <select 
                  value={tokenB}
                  onChange={(e) => setTokenB(e.target.value)}
                  className="bg-black border-2 border-amber-500/40 text-amber-400 rounded-lg px-3 py-2 text-xs font-black outline-none mono cursor-pointer text-center min-w-[100px] hover:border-amber-400 transition-colors"
                >
                  {TOKEN_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <button className="w-full mt-4 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:brightness-110 text-black font-black py-5 rounded-xl transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(245,158,11,0.3)] uppercase tracking-[0.4em] text-sm mono border-t border-white/20">
              Initiate_Swap_Sequence
            </button>
          </div>
        </div>
      </div>

      <ContractAuditor />

      <div className="mt-12 max-w-xs text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/40" />
          <div className="w-2 h-2 bg-amber-500/60 rotate-45" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/40" />
        </div>
        <p className="text-amber-500 text-[10px] font-black mono uppercase tracking-[0.5em] gold-text-glow">
          Blockchain_Guardian_OS // L2_ACTIVE
        </p>
      </div>

      <AdvisoryOverlay analysis={analysis} pair={`${tokenA}/${tokenB}`} />
    </div>
  );
};

export default DexSimulator;