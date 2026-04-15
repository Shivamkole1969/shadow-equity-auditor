"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuditSphere from "@/components/AuditSphere";
import DeceptionIndex from "@/components/DeceptionIndex";
import TranscriptView, { HighlightData } from "@/components/TranscriptView";
import MacroTruthPanel from "@/components/MacroTruthPanel";
import InvestorInsights from "@/components/InvestorInsights";
import { Play, ShieldAlert, Key, Building2, TerminalSquare, AlertCircle, X, ChevronRight, Settings } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<"steady" | "auditing" | "results">("steady");
  const [sphereStatus, setSphereStatus] = useState<"consistent" | "auditing" | "contradiction">("consistent");
  
  // Custom Query States
  const [ticker, setTicker] = useState("");
  const [requirement, setRequirement] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // API Key States
  const [groqKey, setGroqKey] = useState("");
  const [secApiKey, setSecApiKey] = useState("");
  
  const mockHighlights: HighlightData[] = [
    {
      id: "1",
      transcriptText: "Our data center revenue grew exponentially, driving record margins of over 75% this quarter.",
      filingText: "Data Center segment gross margin was 71.2%, negatively impacted by inventory write-offs.",
      status: "contradiction",
      explanation: "Transcript claims margins over 75%, while 10-Q filing explicitly states 71.2% with negative impacts."
    },
    {
      id: "2",
      transcriptText: "Demand in APAC remains robust, and we expect no slowdown in Q1.",
      filingText: "We anticipate potential headwinds in select APAC markets due to export restrictions.",
      status: "contradiction",
      explanation: "Management claims 'no slowdown' while Risk Factors cite 'potential headwinds' & export curbs."
    }
  ];

  const handleAudit = () => {
    if (!ticker) {
      alert("Please enter a company ticker symbol.");
      return;
    }
    if (!groqKey) {
      setSidebarOpen(true);
      alert("Please enter your GROQ API Key to proceed.");
      return;
    }

    setStatus("auditing");
    setSphereStatus("auditing");
    
    // Simulate Data Fetch & API calls
    setTimeout(() => {
      setStatus("results");
      setSphereStatus("contradiction");
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#040914] text-slate-200 p-6 md:p-12 selection:bg-[#00f0ff] selection:text-black overflow-x-hidden relative">
      
      {/* Settings Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-80 glass-panel !rounded-none !border-r-0 !border-t-0 !border-b-0 z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#00f0ff] flex items-center gap-2">
                  <Key size={20} /> User Config
                </h2>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Groq API Key (Required)</label>
                  <input 
                    type="password" 
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00f0ff] text-white transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">Used for ultrafast sub-second LangGraph inference.</p>
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">SEC EDGAR Token (Optional)</label>
                  <input 
                    type="password" 
                    value={secApiKey}
                    onChange={(e) => setSecApiKey(e.target.value)}
                    placeholder="sk_..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00f0ff] text-white transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">By default, standard public rate limits apply.</p>
                </div>
              </div>

              <div className="mt-auto">
                 <button onClick={() => setSidebarOpen(false)} className="w-full py-3 bg-[#00f0ff] text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors">
                   Save Keys
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-[#00f0ff33] pb-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-[#00f0ff]" size={36} />
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-glow text-white">Shadow Equity</h1>
            <p className="text-xs tracking-widest text-[#00f0ff] font-mono">Real-Time Auditor // Vector Subsystem</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-sm font-mono text-slate-300 bg-black/30 px-4 py-2 rounded-lg border border-white/10 hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors"
          >
            <Settings size={16} /> Configure Agents
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Top Section: Hero Sphere & Controls */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Intelligence Query */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 flex flex-col"
          >
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 border-b border-[#00f0ff33] pb-2 flex items-center gap-2">
              <TerminalSquare size={18} className="text-[#00f0ff]"/> Intelligence Query
            </h2>
            
            <div className="space-y-5 flex-1">
              <div>
                 <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00f0ff] mb-2"><Building2 size={14} /> Target Entity</label>
                 <input 
                    type="text" 
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="Enter Ticker (e.g., AAPL, NVDA)"
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-4 text-lg font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] text-white transition-all uppercase"
                  />
              </div>

              <div>
                 <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">Audit Requirement</label>
                 <textarea 
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="E.g., Analyze statements regarding AI infrastructure spending and supply chain disruptions. Summarize core narrative drift."
                    rows={4}
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 text-sm font-sans placeholder:text-slate-600 focus:outline-none focus:border-[#00f0ff] text-white transition-all resize-none"
                  />
              </div>
            </div>

            <button 
              onClick={handleAudit}
              disabled={status === "auditing"}
              className="mt-6 w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "auditing" ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Fetching SEC Data & Auditing...
                </div>
              ) : (
                <>Deploy Agents <ChevronRight size={18}/></>
              )}
            </button>
          </motion.div>
          
          {/* Audit Sphere */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center flex-col relative"
          >
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00f0ff] via-transparent to-transparent blur-3xl pointer-events-none"></div>
            <div className="w-full z-10 scale-110">
              <AuditSphere status={sphereStatus} />
            </div>
            
            {status === "auditing" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 text-[#00f0ff] font-mono text-xs uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full border border-[#00f0ff33]"
              >
                MCP Link Established: Pulling Form 10-K...
              </motion.div>
            )}
            
            {!groqKey && status === "steady" && (
               <div className="absolute top-0 flex items-center gap-2 text-yellow-500 font-mono text-[10px] bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30">
                  <AlertCircle size={10} /> GROQ Key Required
               </div>
            )}
          </motion.div>

          {/* Deception Index */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
          >
            {status === "results" ? (
               <DeceptionIndex score={82} />
            ) : (
              <div className="glass-panel h-full flex flex-col items-center justify-center p-6 text-slate-500 font-mono text-center text-sm border border-dashed border-white/10">
                <ShieldAlert size={48} className="mb-4 opacity-20" />
                Awaiting Target Acquistion.<br/>Index array offline.
              </div>
            )}
          </motion.div>

        </section>

        {/* Bottom Section: Transcript, Macro, & AI Summary */}
        {status === "results" && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TranscriptView data={mockHighlights} />
              </div>
              <div className="lg:col-span-1 border-l border-white/5 pl-8">
                <MacroTruthPanel />
              </div>
            </div>
            
            <InvestorInsights />

          </motion.section>
        )}

      </main>
    </div>
  );
}
