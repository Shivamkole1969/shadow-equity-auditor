"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Key, Zap, ShieldCheck, TrendingUp, Cpu } from "lucide-react";

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserGuide({ isOpen, onClose }: UserGuideProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-20 lg:inset-x-60 lg:inset-y-32 glass-panel z-[101] p-8 overflow-y-auto bg-gradient-to-br from-[#0a0f1a] to-black shadow-[0_0_50px_rgba(0,240,255,0.2)]"
          >
            <div className="flex justify-between items-center mb-8 border-b border-[#00f0ff33] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00f0ff]/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  <BookOpen size={24} className="text-[#00f0ff]" />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-widest text-white text-glow">
                  Vanguard Auditor Protocol
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              >
                <X size={24} className="text-slate-400 group-hover:text-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs uppercase tracking-widest border-l-2 border-[#00f0ff] pl-3">
                  <Key size={14} /> Phase 01: Activation
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Configure Nerve Center</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  The system requires <span className="text-[#00f0ff]">GROQ API Keys</span> to drive the multi-agent neural network. Open the <span className="font-bold text-white">"Configure Agents"</span> sidebar and paste your keys. 
                  <br /><br />
                  <span className="text-xs italic bg-white/5 p-2 rounded block">PRO TIP: Use comma-separated keys to activate parallel load-balancing for 100% uptime.</span>
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs uppercase tracking-widest border-l-2 border-[#00f0ff] pl-3">
                  <Zap size={14} /> Phase 02: Acquisition
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Data Ingestion</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Switch between <span className="text-white font-bold">Auto-Fetch</span> (Instant global market data via MCP) or <span className="text-white font-bold">Manual Upload</span> (Ingest local PDF/TXT filings into the Vector Subsystem).
                  <br /><br />
                  Specify your audit focus—like "debt restructuring" or "AI capex"—in the Protocol Text area.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs uppercase tracking-widest border-l-2 border-[#00f0ff] pl-3">
                  <ShieldCheck size={14} /> Phase 03: Verification
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Multi-Agent Cross-Check</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Every result passes through our <span className="text-[#33ff66] font-bold">Synthesizer & Compliance Agents</span>.
                  Watch the <span className="text-white font-bold">Audit Sphere</span>:
                  <ul className="mt-2 space-y-1 text-xs">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span> Cyan: Real-time scan in progress</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#33ff66]"></span> Green: Financial consistency verified</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ff3333]"></span> Red: Volatile narrative drift detected</li>
                  </ul>
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs uppercase tracking-widest border-l-2 border-[#00f0ff] pl-3">
                  <TrendingUp size={14} /> Phase 04: Execution
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Investor Intelligence</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Harness the <span className="text-white font-bold">Deception Index</span> and <span className="text-white font-bold">Bull/Bear Analysis</span> to make high-conviction decisions. The system fetches live Alpha metrics (P/E, Beta, Growth) dynamically for every company.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#00f0ff11] to-transparent border border-[#00f0ff22] flex items-center gap-6">
              <div className="p-3 bg-white/5 rounded-full shadow-inner">
                 <Cpu size={32} className="text-[#00f0ff] animate-pulse" />
              </div>
              <div>
                <h4 className="text-white font-bold tracking-widest uppercase text-sm">Real-Time Authentication Active</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Our system cross-references Earnings Call semantics against SEC 10-K Ground Truth in less than 2 seconds.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="ml-auto px-8 py-3 bg-[#00f0ff] text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                Launch Protocol
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
