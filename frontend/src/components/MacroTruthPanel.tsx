"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

export default function MacroTruthPanel() {
  const macroData = [
    {
      id: "gdp",
      label: "Real GDP Growth",
      value: "+3.2%",
      trend: "up",
      description: "Q4 2025 YoY",
    },
    {
      id: "cpi",
      label: "Core CPI",
      value: "2.8%",
      trend: "down",
      description: "Feb 2026",
    },
    {
      id: "interest",
      label: "Fed Funds Rate",
      value: "4.50%",
      trend: "neutral",
      description: "Target Range",
    },
    {
      id: "consumer",
      label: "Consumer Sent.",
      value: "78.4",
      trend: "up",
      description: "UoM Index",
    }
  ];

  return (
    <div className="w-full glass-panel flex flex-col h-full bg-gradient-to-br from-black/20 to-black/60 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]">
      <div className="p-5 border-b border-[#00f0ff33] flex justify-between items-center rounded-t-[32px]">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity size={18} className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,1)]" />
          FRED Macro-Truth
        </h2>
        <div className="flex space-x-2 items-center bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 shadow-[0_0_10px_rgba(255,0,0,0.2)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[10px] text-red-500 uppercase tracking-widest font-mono font-bold">Live Synced</span>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-5 p-6">
        {macroData.map((data, idx) => (
          <motion.div 
            key={data.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + idx * 0.1 }}
            className="flex flex-col justify-center items-center p-5 rounded-3xl border border-white/5 bg-[#0a0f1a]/80 shadow-[inset_0_3px_5px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_3px_5px_rgba(255,255,255,0.1),0_15px_30px_rgba(0,240,255,0.15)] transition-all transform hover:-translate-y-1"
          >
            <p className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest text-center mb-1">{data.label}</p>
            <div className="flex items-center">
              <h3 className="text-3xl font-mono text-white font-black drop-shadow-md">{data.value}</h3>
              {data.trend === "up" && <TrendingUp className="ml-2 text-[#33ff66] drop-shadow-[0_0_5px_rgba(51,255,102,0.8)]" size={24} />}
              {data.trend === "down" && <TrendingDown className="ml-2 text-[#ff3333] drop-shadow-[0_0_5px_rgba(255,51,51,0.8)]" size={24} />}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 font-medium bg-black/50 px-2 py-1 rounded-md">{data.description}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="p-3 border-t border-[#00f0ff33] bg-black/60 rounded-b-[32px] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]">
         <p className="text-[10px] text-center text-[#00f0ff]/50 font-mono tracking-widest uppercase">Federal Reserve Economic Data</p>
      </div>
    </div>
  );
}
