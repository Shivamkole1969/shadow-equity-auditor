"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DeceptionIndex({ score }: { score: number }) {
  // Score interpretation
  // 0-30: Low risk (Green)
  // 31-70: Medium risk (Yellow)
  // 71-100: High risk (Red)

  let color = "text-[#33ff66]";
  let strokeColor = "#33ff66";
  
  if (score > 30) {
    color = "text-yellow-400";
    strokeColor = "#facc15";
  }
  if (score > 70) {
    color = "text-[#ff3333]";
    strokeColor = "#ff3333";
  }

  const radius = 45;
  const circumference = Math.PI * 2 * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 glass-panel h-full relative bg-gradient-to-b from-black/80 to-[#030610]">
      <div className="absolute top-6 left-8 text-xs font-bold uppercase tracking-widest text-[#00f0ff] drop-shadow-[0_0_5px_rgba(0,240,255,0.6)]">
        Deception Index
      </div>
      
      <div className="relative w-48 h-48 mt-8 flex items-center justify-center rounded-full shadow-[inset_0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.05)] bg-[#050a14] border border-white/5">
        {/* Glow Behind Circle */}
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20`} style={{ backgroundColor: strokeColor }}></div>
        
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90 z-10 drop-shadow-xl">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-[#030610]"
            style={{ filter: "drop-shadow(inset 0 4px 4px rgba(0,0,0,1))" }}
          />
          {/* Animated Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 12px ${strokeColor}AA)`
            }}
          />
        </svg>
        
        {/* Score Value */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            className={`text-4xl font-bold font-mono ${color} text-glow`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className={`text-sm tracking-widest uppercase font-semibold ${color}`}>
          {score <= 30 ? "Consistent" : score <= 70 ? "Minor Drift" : "Severe Contradiction"}
        </p>
      </div>
    </div>
  );
}
