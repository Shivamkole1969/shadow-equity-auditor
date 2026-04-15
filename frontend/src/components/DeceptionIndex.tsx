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
    <div className="flex flex-col items-center justify-center p-6 glass-panel relative">
      <div className="absolute top-4 left-6 text-sm font-bold uppercase tracking-wider text-slate-400">
        Deception Index
      </div>
      
      <div className="relative w-40 h-40 mt-4 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Animated Circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor}88)`
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
