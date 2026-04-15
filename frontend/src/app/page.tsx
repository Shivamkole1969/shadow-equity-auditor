"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuditSphere from "@/components/AuditSphere";
import DeceptionIndex from "@/components/DeceptionIndex";
import TranscriptView, { HighlightData } from "@/components/TranscriptView";
import MacroTruthPanel from "@/components/MacroTruthPanel";
import InvestorInsights from "@/components/InvestorInsights";
import { Play, ShieldAlert, Key, Building2, TerminalSquare, AlertCircle, X, ChevronRight, Settings, Loader2 } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<"steady" | "auditing" | "results">("steady");
  const [sphereStatus, setSphereStatus] = useState<"consistent" | "auditing" | "contradiction">("consistent");
  
  // Custom Query States
  const [queryMode, setQueryMode] = useState<"auto" | "manual">("auto");
  
  // Ticker Search States
  const [ticker, setTicker] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [requirement, setRequirement] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // API Key States
  const [groqKey, setGroqKey] = useState("");
  const [secApiKey, setSecApiKey] = useState("");

  // Fetched Data
  const [apiData, setApiData] = useState<any>(null);

  // Trigger search on debounce
  useEffect(() => {
    if (queryMode !== "auto") return;
    const delayDebounceFn = setTimeout(() => {
      if (ticker.length > 0) {
        setIsSearching(true);
        fetch(`/search?q=${ticker}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data.results || []);
            setShowDropdown(data.results && data.results.length > 0);
          })
          .catch(() => setSearchResults([]))
          .finally(() => setIsSearching(false));
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [ticker, queryMode]);

  const selectTicker = (sym: string) => {
    setTicker(sym);
    setShowDropdown(false);
  };

  const handleAudit = async () => {
    if (queryMode === "auto" && !ticker) {
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
    
    try {
      const res = await fetch("/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: ticker,
          requirement: requirement,
          groq_key: groqKey,
          sec_key: secApiKey
        })
      });
      const data = await res.json();
      setApiData(data);
      setStatus("results");
      setSphereStatus(data.deception_score > 60 ? "contradiction" : "consistent");
    } catch (err) {
      alert("Failed to reach processing cluster.");
      setStatus("steady");
      setSphereStatus("consistent");
    }
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
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Groq API Keys</label>
                  <input 
                    type="password" 
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_..., gsk_..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00f0ff] text-white transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">Paste multiple keys separated by commas to load-balance ultrafast LLM calls.</p>
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Global Market Token (Optional)</label>
                  <input 
                    type="password" 
                    value={secApiKey}
                    onChange={(e) => setSecApiKey(e.target.value)}
                    placeholder="sk_..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00f0ff] text-white transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">Overrides rate limits for multiple global exchanges.</p>
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
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 flex flex-col relative"
          >
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-[#00f0ff33] pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2"><TerminalSquare size={18} className="text-[#00f0ff]"/> Intelligence Query</span>
            </h2>

            <div className="flex items-center bg-black/50 p-1 rounded-lg border border-white/10 mb-5 relative">
               <button 
                 onClick={() => setQueryMode("auto")} 
                 className={`flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-md transition-colors z-10 ${queryMode === "auto" ? "text-black" : "text-slate-400 hover:text-white"}`}
               >
                 Auto-Fetch
               </button>
               <button 
                 onClick={() => setQueryMode("manual")} 
                 className={`flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-md transition-colors z-10 ${queryMode === "manual" ? "text-black" : "text-slate-400 hover:text-white"}`}
               >
                 Manual Upload
               </button>
               <motion.div 
                 className="absolute inset-y-1 w-[calc(50%-4px)] bg-[#00f0ff] rounded-md z-0 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                 animate={{ left: queryMode === "auto" ? "4px" : "calc(50%)" }}
                 transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
               />
            </div>
            
            <div className="space-y-4 flex-1">
              <AnimatePresence mode="wait">
                {queryMode === "auto" ? (
                  <motion.div key="auto" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#00f0ff] mb-1">Target Entity / Ticker</label>
                      <input 
                          type="text" 
                          value={ticker}
                          onChange={(e) => { setTicker(e.target.value.toUpperCase()); setShowDropdown(true); }}
                          onFocus={() => { if(searchResults.length) setShowDropdown(true) }}
                          placeholder="Search Company (e.g., AAPL, NVDA)"
                          className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] text-white transition-all uppercase"
                        />
                        {isSearching && <Loader2 className="absolute right-3 top-[26px] animate-spin text-slate-500" size={16} />}
                        
                        {/* AutoComplete Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                          <div className="absolute top-full left-0 w-full mt-1 bg-[#0a0f1a] border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
                            {searchResults.map((res: any, idx) => (
                              <div 
                                key={idx} 
                                onClick={() => selectTicker(res.symbol)}
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center"
                              >
                                <div>
                                  <div className="font-bold text-[#00f0ff]">{res.symbol}</div>
                                  <div className="text-xs text-slate-400">{res.name}</div>
                                </div>
                                <div className="text-[10px] uppercase font-mono px-2 py-1 bg-black/50 rounded text-slate-300">
                                  {res.exchange}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-[#00f0ff] mb-1">Upload Documents (PDF / TXT)</label>
                     <div className="w-full border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#00f0ff] transition-colors cursor-pointer bg-black/40">
                        <div className="bg-[#00f0ff]/10 p-3 rounded-full mb-2">
                           <TerminalSquare size={20} className="text-[#00f0ff]" />
                        </div>
                        <p className="text-xs text-white">Drag & drop financial reports</p>
                        <p className="text-[10px] text-slate-500 mt-1">Accepts multiple standard formats</p>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                 <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1 mt-2">Audit Requirement Override</label>
                 <textarea 
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="E.g., Analyze statements regarding AI infrastructure spending and supply chain disruptions."
                    rows={3}
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 text-xs font-sans placeholder:text-slate-600 focus:outline-none focus:border-[#00f0ff] text-white transition-all resize-none"
                  />
              </div>
            </div>

            <button 
              onClick={handleAudit}
              disabled={status === "auditing"}
              className="mt-5 w-full py-3 rounded-xl font-bold uppercase tracking-widest bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "auditing" ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </div>
              ) : (
                <>Deploy Agents <ChevronRight size={18}/></>
              )}
            </button>
          </motion.div>
          
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
                Connecting via MCP to Global Markets...
              </motion.div>
            )}
            
            {!groqKey && status === "steady" && (
               <div className="absolute top-0 flex items-center gap-2 text-yellow-500 font-mono text-[10px] bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30">
                  <AlertCircle size={10} /> GROQ Key Required
               </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
          >
            {status === "results" && apiData ? (
               <DeceptionIndex score={apiData.deception_score} />
            ) : (
              <div className="glass-panel h-full flex flex-col items-center justify-center p-6 text-slate-500 font-mono text-center text-sm border border-dashed border-white/10">
                <ShieldAlert size={48} className="mb-4 opacity-20" />
                Awaiting Target Acquistion.<br/>Index array offline.
              </div>
            )}
          </motion.div>

        </section>

        {status === "results" && apiData && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TranscriptView data={apiData.discrepancies || []} />
              </div>
              <div className="lg:col-span-1 border-l border-white/5 pl-8">
                <MacroTruthPanel />
              </div>
            </div>
            
            <InvestorInsights insights={apiData.insights} />

          </motion.section>
        )}

      </main>
    </div>
  );
}
