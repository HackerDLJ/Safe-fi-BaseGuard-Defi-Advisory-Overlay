import React, { useState, useEffect } from 'react';
import { TradeAnalysis } from '../types';
import { getAIAdvisorOpinion } from '../services/geminiService';

interface AdvisoryOverlayProps {
  analysis: TradeAnalysis | null;
  pair: string;
}

const AdvisoryOverlay: React.FC<AdvisoryOverlayProps> = ({ analysis, pair }) => {
  const [aiOpinion, setAiOpinion] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (analysis) {
      setLoading(true);
      setAiOpinion("Processing market telemetry...");
      
      getAIAdvisorOpinion(analysis, pair).then(opinion => {
        if (active) {
          setAiOpinion(opinion);
          setLoading(false);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [analysis, pair]);

  if (!analysis) return null;

  const isDangerous = analysis.health === 'Risky';
  const isWarning = analysis.health === 'Warning';

  return (
    <div className={`fixed top-6 right-6 w-80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-xl border-l-4 transition-all duration-500 animate-in slide-in-from-right-4 glass overflow-hidden ${
      isDangerous ? 'border-red-500 ring-1 ring-red-500/20' : 
      isWarning ? 'border-amber-400 ring-1 ring-amber-400/20' : 
      'border-emerald-500 ring-1 ring-emerald-500/20'
    }`}>
      {/* HUD Header */}
      <div className="px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            loading ? 'animate-pulse bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 
            isDangerous ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 
            isWarning ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 
            'bg-emerald-500 shadow-[0_0_8px_#10b981]'
          }`} />
          <span className="text-[10px] font-black text-white tracking-[0.25em] mono uppercase gold-text-glow">Guardian_HUD</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[8px] font-black text-emerald-400 mono">LINK: STABLE</span>
        </div>
      </div>

      <div className="p-4 space-y-5 bg-gradient-to-b from-transparent to-black/30">
        {/* Metric Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/60 p-3 rounded-lg border border-amber-500/10 group hover:border-amber-500/40 transition-colors">
            <p className="text-[8px] text-amber-500/60 mono uppercase mb-1 font-black">Price_Impact</p>
            <p className={`text-sm font-black mono gold-text-glow ${isDangerous ? 'text-red-400' : 'text-amber-400'}`}>
              {analysis.priceImpact.toFixed(3)}%
            </p>
          </div>
          <div className="bg-black/60 p-3 rounded-lg border border-amber-500/10 group hover:border-amber-500/40 transition-colors">
            <p className="text-[8px] text-amber-500/60 mono uppercase mb-1 font-black">Audit_Sig</p>
            <p className="text-sm font-black mono text-emerald-400 uppercase tracking-tighter">VALIDATED</p>
          </div>
        </div>

        {/* Suggestion Box */}
        <div className="relative group">
          <div className="absolute inset-0 bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all opacity-0 group-hover:opacity-100" />
          <div className="relative bg-black/60 rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-1 h-3.5 bg-amber-500 rounded-full" />
              <p className="font-black text-amber-500 mono uppercase tracking-widest text-[10px]">Contract_Logic</p>
            </div>
            <p className="text-white/90 leading-relaxed italic mono text-[11px] font-medium">
              {analysis.suggestedAction}
            </p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-amber-400/10 to-transparent rounded-xl p-4 border border-amber-400/30">
          <div className="flex items-center justify-between mb-2.5">
            <p className="font-black text-amber-400 flex items-center gap-1.5 mono uppercase tracking-widest text-[10px] gold-text-glow">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
              Neural_Advisory
            </p>
            <div className="text-[8px] text-amber-500/50 mono tracking-tighter uppercase font-black">{loading ? 'Processing...' : 'Gemini_V3_Active'}</div>
          </div>
          <div className="text-white/80 leading-relaxed font-semibold mono text-[10px] min-h-[4em] bg-black/30 p-2 rounded-lg border border-white/5">
            {aiOpinion}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2.5 bg-black/40 border-2 border-amber-500/40 text-amber-500 text-[10px] font-black rounded-lg hover:bg-amber-500 hover:text-black transition-all mono uppercase tracking-widest active:scale-95">
            Audit_Code
          </button>
          {analysis.health !== 'Safe' && (
            <button className="flex-1 py-2.5 bg-gradient-to-br from-amber-400 to-yellow-600 text-black text-[10px] font-black rounded-lg hover:brightness-110 transition-all mono uppercase tracking-widest active:scale-95 shadow-[0_5px_15px_rgba(245,158,11,0.2)]">
              Optimize
            </button>
          )}
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent w-full opacity-60" />
    </div>
  );
};

export default AdvisoryOverlay;