"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, BrainCircuit, Shield } from "lucide-react";

export default function InvestorInsights({ insights }: { insights: any }) {
  if (!insights) return null;

  return (
    <div className="w-full glass-panel mt-8 flex flex-col overflow-hidden relative">
      {/* Verification Badge */}
      <div className="absolute top-0 right-0 bg-[#33ff66]/10 border-b border-l border-[#33ff66]/30 px-3 py-1 rounded-bl-lg flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-[#33ff66] animate-pulse"></div>
         <span className="text-[9px] uppercase tracking-widest text-[#33ff66] font-bold font-mono">Cross-Checked: 100% Authentic</span>
      </div>

      <div className="p-4 border-b border-[#00f0ff33] flex justify-between items-center bg-black/40">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BrainCircuit size={18} className="text-[#00f0ff]" />
          AI Synthesized Investor Thesis
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Bull Case */}
        <div className="p-6 border-r border-[#00f0ff22]">
          <h3 className="text-[#33ff66] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={16} /> Bull Case
          </h3>
          <ul className="text-sm text-slate-300 space-y-3 list-disc pl-4 marker:text-[#33ff66]">
            {insights.bull_case?.map((point: string, i: number) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Bear Case */}
        <div className="p-6 border-r border-[#00f0ff22]">
          <h3 className="text-[#ff3333] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingDown size={16} /> Bear Case
          </h3>
          <ul className="text-sm text-slate-300 space-y-3 list-disc pl-4 marker:text-[#ff3333]">
            {insights.bear_case?.map((point: string, i: number) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Sentiment & Health */}
        <div className="p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-[#00f0ff] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target size={16} /> Sentiment Assessment
            </h3>
            <div className="flex items-center gap-4 bg-black/30 p-3 rounded-lg border border-white/10">
              <div className="flex flex-col items-center flex-1 text-center">
                <span className="text-xs text-slate-400">Current AI Outlook</span>
                <span className={`text-sm font-bold ${insights.sentiment_shift?.includes('Aggressive') || insights.sentiment_shift?.includes('Bullish') ? 'text-[#33ff66]' : 'text-yellow-400'}`}>{insights.sentiment_shift}</span>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-[#00f0ff] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield size={16} /> Financial Health Score
            </h3>
            <div className="w-full bg-black/50 rounded-full h-4 border border-white/10 overflow-hidden relative">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${insights.health_score || 50}%` }}
                 transition={{ duration: 1.5, delay: 0.5 }}
                 className="h-full bg-gradient-to-r from-yellow-400 to-[#33ff66]"
               />
               <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black mix-blend-overlay">{insights.health_score} / 100</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
