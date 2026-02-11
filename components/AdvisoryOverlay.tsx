
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
    if (analysis) {
      setLoading(true);
      getAIAdvisorOpinion(analysis, pair).then(opinion => {
        setAiOpinion(opinion);
        setLoading(false);
      });
    }
  }, [analysis, pair]);

  if (!analysis) return null;

  const isDangerous = analysis.health === 'Risky';
  const isWarning = analysis.health === 'Warning';

  return (
    <div className={`fixed top-6 right-6 w-80 shadow-2xl rounded-xl border-l-4 transition-all duration-500 animate-in slide-in-from-right-4 glass overflow-hidden ${
      isDangerous ? 'border-red-500 shadow-red-500/20' : 
      isWarning ? 'border-amber-400 shadow-amber-400/20' : 
      'border-emerald-500 shadow-emerald-500/20'
    }`}>
      {/* HUD Header */}
      <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isDangerous ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          <span className="text-[10px] font-bold text-white tracking-[0.2em] mono uppercase">BaseGuard_HUD</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Metric Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <p className="text-[9px] text-white/40 mono uppercase mb-1">Impact_Lv</p>
            <p className={`text-sm font-bold mono ${isDangerous ? 'text-red-400' : 'text-amber-400'}`}>
              {analysis.priceImpact.toFixed(2)}%
            </p>
          </div>
          <div className="bg-black/40 p-2 rounded border border-white/5">
            <p className="text-[9px] text-white/40 mono uppercase mb-1">Sec_Status</p>
            <p className={`text-sm font-bold mono ${isDangerous ? 'text-red-500' : 'text-emerald-400'}`}>
              {analysis.health.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Suggestion Box */}
        <div className="relative group">
          <div className="absolute inset-0 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors" />
          <div className="relative bg-white/5 rounded-lg p-3 text-[11px] border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-3 bg-amber-500" />
              <p className="font-black text-amber-500 mono uppercase tracking-wider">Tactical_Briefing</p>
            </div>
            <p className="text-white/80 leading-relaxed italic mono">
              {analysis.suggestedAction}
            </p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-amber-400/5 rounded-lg p-3 text-[10px] border border-amber-400/20">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-amber-400 flex items-center gap-1 mono uppercase tracking-tighter">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              AI_NEURAL_REPORT
            </p>
            <div className="text-[8px] text-amber-500/40 mono tracking-tighter">GEMINI_3_FLASH</div>
          </div>
          <div className="text-white/70 leading-relaxed font-medium mono">
            {loading ? (
              <div className="flex gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce delay-150" />
              </div>
            ) : aiOpinion}
          </div>
        </div>

        {analysis.health !== 'Safe' && (
          <button className="w-full py-2 bg-transparent border border-amber-500/50 text-amber-500 text-[10px] font-bold rounded hover:bg-amber-500 hover:text-black transition-all mono uppercase tracking-widest">
            Search_Optimal_Pool
          </button>
        )}
      </div>

      {/* Animated HUD Footer Line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent w-full" />
    </div>
  );
};

export default AdvisoryOverlay;
