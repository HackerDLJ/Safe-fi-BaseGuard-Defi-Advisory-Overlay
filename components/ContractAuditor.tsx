import React from 'react';

const ContractAuditor: React.FC = () => {
  const code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TradeGuardian {
    struct Analysis {
        uint256 expectedOutput;
        uint256 priceImpact; // Scaled 1e4
        bool isSafe;
        string warning;
    }

    function analyzeTrade(
        uint256 amountIn,
        uint256 resIn,
        uint256 resOut
    ) external pure returns (Analysis memory) {
        uint256 amountInWithFee = amountIn * 997;
        uint256 dy = (amountInWithFee * resOut) / 
                     ((resIn * 1000) + amountInWithFee);
        
        uint256 impact = 10000 - ((dy * resIn * 10000) / 
                                  (amountIn * resOut));
        
        return Analysis(dy, impact, impact < 300, "SECURE");
    }
}`;

  return (
    <div className="mt-8 w-full max-w-md glass rounded-xl border-2 border-amber-500/30 overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg className="w-24 h-24 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45z" />
        </svg>
      </div>
      
      <div className="px-4 py-3 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[10px] font-black text-amber-400 mono uppercase tracking-widest gold-text-glow">Verified_Source: TradeGuardian.sol</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-[8px] text-emerald-400 font-bold mono">LOGIC_VERIFIED</span>
        </div>
      </div>
      
      <div className="p-4 bg-black/50 backdrop-blur-sm">
        <pre className="text-[10px] text-amber-400/80 mono leading-relaxed overflow-x-auto whitespace-pre scrollbar-hide">
          {code}
        </pre>
      </div>
      
      <div className="px-4 py-3 bg-amber-500/5 border-t border-amber-500/20 flex justify-between items-center">
        <span className="text-[9px] text-amber-500/50 mono uppercase font-bold">Audit_Hash: 0x82f...a1c2</span>
        <button className="text-[9px] bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black px-3 py-1 rounded transition-all mono uppercase font-black tracking-widest">
          View_On_BaseScan
        </button>
      </div>
    </div>
  );
};

export default ContractAuditor;