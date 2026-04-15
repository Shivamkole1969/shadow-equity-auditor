"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AuditSphere from "@/components/AuditSphere";
import DeceptionIndex from "@/components/DeceptionIndex";
import TranscriptView, { HighlightData } from "@/components/TranscriptView";
import MacroTruthPanel from "@/components/MacroTruthPanel";
import { UploadCloud, FileText, Database, Play, ShieldAlert } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<"steady" | "auditing" | "results">("steady");
  const [sphereStatus, setSphereStatus] = useState<"consistent" | "auditing" | "contradiction">("consistent");
  
  // Dummy "Gold Set" (NVIDIA/Tesla scenario)
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
    },
    {
      id: "3",
      transcriptText: "Operating expenses decreased by 5% sequentially due to efficiency gains.",
      filingText: "Total operating expenses decreased by 4.8% sequentially primarily due to reduced stock-based compensation.",
      status: "consistent",
      explanation: "Numeric claim generally matches, minor difference in rounding and underlying reason."
    }
  ];

  const handleAudit = () => {
    setStatus("auditing");
    setSphereStatus("auditing");
    
    // Simulate backend LangGraph processing
    setTimeout(() => {
      setStatus("results");
      setSphereStatus("contradiction");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#040914] text-slate-200 p-6 md:p-12 selection:bg-[#00f0ff] selection:text-black">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-[#00f0ff33] pb-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-[#00f0ff]" size={36} />
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-glow text-white">Shadow Equity</h1>
            <p className="text-xs tracking-widest text-[#00f0ff] font-mono">Compliance Auditor // v2.0</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm font-mono text-slate-400 bg-black/30 px-3 py-1 rounded-full border border-white/10">
            <Database size={14} className="text-[#33ff66]" /> ChromaDB Vector Store: Online
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Section: Hero Sphere & Controls */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Data Vault Upload */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-[#00f0ff33] pb-2">
                Data Vault
              </h2>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-black/50 border border-white/10 p-3 rounded-lg flex items-center gap-3">
                  <FileText className="text-[#00f0ff]" />
                  <div className="flex-1">
                    <p className="text-white">NVDA_Q4_Earnings_Call.pdf</p>
                    <p className="text-[10px] text-slate-500">Loaded 2 mins ago</p>
                  </div>
                </div>
                
                <div className="bg-black/50 border border-white/10 p-3 rounded-lg flex items-center gap-3">
                  <FileText className="text-slate-400" />
                  <div className="flex-1">
                    <p className="text-white">NVDA_10K_FY23.pdf</p>
                    <p className="text-[10px] text-slate-500">Loaded 10 mins ago</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAudit}
              disabled={status === "auditing"}
              className="mt-6 w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play size={18} />
              {status === "auditing" ? "Running LangGraph Agents..." : "Run AI Auditor"}
            </button>
          </motion.div>
          
          {/* Audit Sphere */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center flex-col relative"
          >
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00f0ff] via-transparent to-transparent blur-3xl pointer-events-none"></div>
            <div className="w-full z-10">
              <AuditSphere status={sphereStatus} />
            </div>
            
            {status === "auditing" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-0 text-[#00f0ff] font-mono text-xs uppercase tracking-widest bg-black/60 px-4 py-1 rounded-full border border-[#00f0ff33]"
              >
                Cross-Referencing Narratives...
              </motion.div>
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
              <div className="glass-panel h-full flex items-center justify-center p-6 text-slate-500 font-mono text-center text-sm border-dashed">
                Awaiting audit execution.<br/>Deception Index will populate here.
              </div>
            )}
          </motion.div>

        </section>

        {/* Bottom Section: Transcript & Macro */}
        {status === "results" && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <TranscriptView data={mockHighlights} />
            </div>
            <div className="lg:col-span-1">
              <MacroTruthPanel />
            </div>
          </motion.section>
        )}

      </main>
    </div>
  );
}
