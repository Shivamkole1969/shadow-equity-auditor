"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export interface HighlightData {
  id: string;
  transcriptText: string;
  filingText: string;
  status: "consistent" | "contradiction";
  explanation: string;
}

export default function TranscriptView({ data }: { data: HighlightData[] }) {
  return (
    <div className="w-full glass-panel flex flex-col h-[500px]">
      <div className="flex border-b border-[#00f0ff33] p-5 bg-gradient-to-b from-black/50 to-transparent rounded-t-[32px]">
        <div className="w-1/2 px-4 border-r border-[#00f0ff33]">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Info size={18} className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,1)]" />
            Earnings Transcript
          </h2>
          <p className="text-xs text-[#00f0ff]/70 mt-1">Extracts from the active Audio Stream</p>
        </div>
        <div className="w-1/2 px-8">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Info size={18} className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,1)]" />
            Filing Ground Truth
          </h2>
          <p className="text-xs text-[#00f0ff]/70 mt-1">Cross-referenced Official Data</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {data.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`flex flex-col rounded-3xl overflow-hidden border shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md ${item.status === 'contradiction' ? 'border-[#ff333333] bg-gradient-to-br from-[#ff333311] to-black/80' : 'border-[#33ff6633] bg-gradient-to-br from-[#33ff6611] to-black/80'}`}
          >
            <div className="flex w-full relative">
              {/* Central Divider Glow */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
              
              <div className="w-1/2 p-6 z-10">
                <p className="text-sm leading-relaxed text-white font-medium drop-shadow-md">
                  "{item.transcriptText}"
                </p>
              </div>
              <div className="w-1/2 p-6 z-10">
                <p className="text-sm leading-relaxed text-white font-medium drop-shadow-md">
                  "{item.filingText}"
                </p>
              </div>
            </div>
            
            <div className={`p-4 flex items-start gap-4 shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)] bg-black/60 ${item.status === 'contradiction' ? 'border-t border-[#ff333333]' : 'border-t border-[#33ff6633]'}`}>
              {item.status === 'contradiction' ? (
                <div className="p-2 bg-[#ff3333]/10 rounded-full shrink-0 shadow-[0_0_15px_rgba(255,51,51,0.3)]">
                  <AlertCircle className="text-[#ff3333]" size={20} />
                </div>
              ) : (
                <div className="p-2 bg-[#33ff66]/10 rounded-full shrink-0 shadow-[0_0_15px_rgba(51,255,102,0.3)]">
                  <CheckCircle2 className="text-[#33ff66]" size={20} />
                </div>
              )}
              <div className="text-sm self-center">
                <span className={`font-black tracking-widest uppercase mr-3 ${item.status === 'contradiction' ? 'text-[#ff3333] drop-shadow-[0_0_5px_rgba(255,51,51,0.5)]' : 'text-[#33ff66] drop-shadow-[0_0_5px_rgba(51,255,102,0.5)]'}`}>
                  {item.status === 'contradiction' ? 'NARRATIVE DRIFT DETECTED:' : 'CONSISTENT:'}
                </span>
                <span className="text-slate-300 font-medium">{item.explanation}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
