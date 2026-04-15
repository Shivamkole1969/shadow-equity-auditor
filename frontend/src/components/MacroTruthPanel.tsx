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
    <div className="w-full glass-panel flex flex-col h-full bg-black/40">
      <div className="p-4 border-b border-[#00f0ff33] flex justify-between items-center">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity size={18} className="text-[#00f0ff]" />
          FRED Macro-Truth Dashboard
        </h2>
        <div className="flex space-x-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs text-red-500 uppercase tracking-widest font-mono">Live</span>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        {macroData.map((data, idx) => (
          <motion.div 
            key={data.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + idx * 0.1 }}
            className="flex flex-col justify-center items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <p className="text-xs text-slate-400 uppercase tracking-wider text-center">{data.label}</p>
            <div className="flex items-center mt-2">
              <h3 className="text-2xl font-mono text-white font-bold">{data.value}</h3>
              {data.trend === "up" && <TrendingUp className="ml-2 text-[#33ff66]" size={20} />}
              {data.trend === "down" && <TrendingDown className="ml-2 text-[#ff3333]" size={20} />}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">{data.description}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="p-3 border-t border-[#00f0ff33] bg-black/60 rounded-b-xl">
         <p className="text-xs text-center text-slate-400 font-mono tracking-tight">Source: Federal Reserve Economic Data (FRED)</p>
      </div>
    </div>
  );
}
