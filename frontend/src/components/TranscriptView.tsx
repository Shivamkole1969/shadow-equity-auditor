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
      <div className="flex border-b border-[#00f0ff33] p-4 bg-black/40 rounded-t-2xl">
        <div className="w-1/2 px-4 shadow-[inset_-1px_0_0_0_#00f0ff33]">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Info size={18} className="text-[#00f0ff]" />
            Earnings Transcript
          </h2>
          <p className="text-xs text-slate-400 mt-1">Extracts from the Q4 Earnings Call</p>
        </div>
        <div className="w-1/2 px-8">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Info size={18} className="text-[#00f0ff]" />
            SEC 10-K/10-Q Filing
          </h2>
          <p className="text-xs text-slate-400 mt-1">Ground truth financial statements</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {data.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`flex flex-col rounded-xl overflow-hidden border ${item.status === 'contradiction' ? 'border-[#ff3333aa] bg-[#ff333311]' : 'border-[#33ff66aa] bg-[#33ff6611]'}`}
          >
            <div className="flex w-full">
              <div className="w-1/2 p-4 border-r border-white/10">
                <p className="text-sm leading-relaxed text-slate-200">
                  "{item.transcriptText}"
                </p>
              </div>
              <div className="w-1/2 p-4">
                <p className="text-sm leading-relaxed text-slate-200">
                  "{item.filingText}"
                </p>
              </div>
            </div>
            
            <div className={`p-3 flex items-start gap-3 border-t bg-black/60 ${item.status === 'contradiction' ? 'border-[#ff333355]' : 'border-[#33ff6655]'}`}>
              {item.status === 'contradiction' ? (
                <AlertCircle className="text-[#ff3333] shrink-0 mt-0.5" size={18} />
              ) : (
                <CheckCircle2 className="text-[#33ff66] shrink-0 mt-0.5" size={18} />
              )}
              <div className="text-sm">
                <span className={`font-semibold mr-2 ${item.status === 'contradiction' ? 'text-[#ff3333]' : 'text-[#33ff66]'}`}>
                  {item.status === 'contradiction' ? 'NARRATIVE DRIFT DETECTED:' : 'CONSISTENT:'}
                </span>
                <span className="text-slate-300">{item.explanation}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
