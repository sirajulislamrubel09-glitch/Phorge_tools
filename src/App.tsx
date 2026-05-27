/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  FileText, Image as ImageIcon, FileSpreadsheet, Binary, GraduationCap, Briefcase, ShieldAlert, Calendar, Sparkles,
  Hash, ClipboardList, Clock, Code, Eye, Layers, ShieldCheck, Download, Copy, Bookmark, Compass,
  ChevronRight, Search, Menu, X, Plus, Play, Pause, RotateCcw, Flame, QrCode, Braces, Terminal, 
  CaseUpper, HeartPulse, Sparkle, Undo2, Lock, Coins, Shield, Calculator, Check, Activity, Smile, 
  Trash2, Sliders, ChevronDown, CheckCircle2, Server, Globe, HelpCircle, Settings, User, LogOut,
  AppWindow, FileSignature, Receipt, Info, Laptop, LockKeyhole, EyeOff, Info as InfoIcon, Send
} from "lucide-react";
import { CATEGORIES, TOOLS } from "./data/tools";
import { ToolItem, ToolCategory } from "./types";
import VirtualCube from "./components/3d/VirtualCube";
import ToolWorkspace from "./components/ToolWorkspace";
import CommandPalette from "./components/CommandPalette";

// Mapping of string keys to Lucide icons for robust, compile-safe dynamic render
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  FileText, Image: ImageIcon, FileSpreadsheet, Binary, GraduationCap, Briefcase, ShieldAlert, Calendar, Sparkles,
  Hash, ClipboardList, Clock, Code, Eye, Layers, ShieldCheck, Download, Copy, Bookmark, Compass,
  Flame, QrCode, Braces, Terminal, CaseUpper, HeartPulse, Sparkle, Undo2, Lock, Coins, Shield, 
  Calculator, Check, Activity, Smile, Trash2, Settings, User, Globe, HelpCircle,
  Invoice: Briefcase, Receipt, FileSignature, Info
};

function SmartIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const IconComponent = ICON_MAP[name] || Terminal;
  return <IconComponent className={className} />;
}

export default function App() {
  // Navigation & Filter states
  const [currentView, setCurrentView] = useState<"home" | "directory" | "tool" | "about" | "contact" | "privacy" | "terms" | "install">("home");
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // User Stats & Local caching states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "alert">("success");

  // Load persistence states offline
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("phorge_favs");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedRecent = localStorage.getItem("phorge_recent");
      if (savedRecent) setRecentlyUsed(JSON.parse(savedRecent));
    } catch (e) {
      console.warn("Local storage cache not initiated in current sandbox.");
    }
  }, []);

  // System toast notification trigger
  const showToast = (msg: string, type: "success" | "info" | "alert" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (toolId: string) => {
    let next: string[];
    if (favorites.includes(toolId)) {
      next = favorites.filter(id => id !== toolId);
      showToast("Removed from system favorites", "info");
    } else {
      next = [...favorites, toolId];
      showToast("Pinned to system favorites!", "success");
    }
    setFavorites(next);
    localStorage.setItem("phorge_favs", JSON.stringify(next));
  };

  const recordUsage = (toolId: string) => {
    let next = [toolId, ...recentlyUsed.filter(id => id !== toolId)].slice(0, 5);
    setRecentlyUsed(next);
    localStorage.setItem("phorge_recent", JSON.stringify(next));
  };

  // Listen to search Command shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, []);

  // Open specific tool from dynamic references
  const handleOpenTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setCurrentView("tool");
    recordUsage(toolId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categoriesMap = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<ToolCategory, typeof CATEGORIES[0]>);
  }, []);

  // Filter tools based on search logic and category filters
  const filteredTools = useMemo(() => {
    return TOOLS.filter(t => {
      const matchCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchSearch = searchQuery.trim() === "" || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tg => tg.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedTool = useMemo(() => {
    return TOOLS.find(t => t.id === selectedToolId) || TOOLS[0];
  }, [selectedToolId]);

  // Frequently visited tools list mapping
  const quickAccessList = useMemo(() => {
    return [
      { id: "qr-code-generator", name: "QR Generator" },
      { id: "password-generator", name: "Password Generator" },
      { id: "word-counter", name: "Word Counter" },
      { id: "json-formatter", name: "JSON Formatter" },
      { id: "palette-generator", name: "Palette Generator" }
    ];
  }, []);

  // Popular grid lists mapped manually from mock
  const popularTools = useMemo(() => {
    return TOOLS.filter(t => t.trending).slice(0, 5);
  }, []);

  // Mapped diagnostic entries for FAQ Accordions
  const systemFaqs = [
    { q: "How are standard tools able to compile and format completely offline?", a: "PHORGE TOOLS is standard-architectured with high-performance native javascript processing libraries. When you input variables or document blocks, execution happens entirely inside the browser sandboxed thread layer. No network fetch commands are spawned." },
    { q: "Is registration or Premium account synching strictly necessary?", a: "No. The utility deck is fully primed for high-speed offline access right out of the box. Synching is only optional to backup local preferences across devices." },
    { q: "Can we install the application onto desktop workstations?", a: "Yes. By saving the PWA setup onto your deck via the Chrome navbar, PHORGE iconizes as an independent operating window styled in full cyber aesthetics." }
  ];

  return (
    <div id="phorge-cockpit" className="min-h-screen bg-[#08110d] text-[#e0e0e0] flex relative overflow-hidden cyber-scanline">
      
      {/* Background radial neon leaks and grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00ff88] blur-[150px] opacity-[0.07] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#00d26a] blur-[120px] opacity-[0.05] pointer-events-none" />

      {/* TOAST SYSTEM ALERTS */}
      {toastMessage && (
        <div 
          id="system-toast"
          className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border bg-black flex items-center gap-3 shadow-[0_0_30px_rgba(0,255,136,0.2)] animate-bounce border-cyber-green/45 text-cyber-green"
        >
          <Sparkle className="w-4 h-4 animate-spin" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* COMMAND PALETTE POPUP */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
        onSelectTool={handleOpenTool} 
      />

      {/* =========================================================
          LEFT SIDEBAR COCKPIT (Desktop Only)
         ========================================================= */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-emerald-500/10 bg-[#08110d]/40 backdrop-blur-sm flex-col gap-6 p-6 select-none relative z-20">
        
        {/* Brand visual header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#00ff88] to-[#00d26a] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.4)] shrink-0">
            <div className="w-4 h-4 bg-[#08110d] rotate-45"></div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tighter text-white">PHORGE<span className="text-[#00ff88]">.</span>TOOLS</h1>
            <span className="text-[8px] font-mono tracking-widest text-emerald-500/80 block -mt-1">UTILITY DECK</span>
          </div>
          <span className="ml-auto text-[8px] font-mono border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/5 text-[#00ff88]">V_1.2</span>
        </div>

        {/* Command Search box link */}
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-black/40 border border-emerald-500/10 hover:border-[#00ff88]/30 text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-emerald-100/40 group-hover:text-emerald-100/80">
            <Search className="w-3.5 h-3.5 text-[#00ff88]" />
            <span className="font-sans text-xs">Search tools...</span>
          </div>
          <kbd className="font-mono text-[9px] text-[#00ff88]/60 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/10 group-hover:text-cyber-green group-hover:border-[#00ff88]/30">⌘K</kbd>
        </button>

        {/* Categories Group Tab Filters */}
        <div className="flex flex-col gap-5 overflow-y-auto pr-1">
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 font-bold ml-1 mb-2">Navigation Index</span>
            
            <button 
              onClick={() => { setCurrentView("home"); setSelectedToolId(null); }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium font-sans border-r-2 transition-all cursor-pointer ${
                currentView === "home" 
                  ? "bg-emerald-500/10 border-[#00ff88] text-[#00ff88] rounded-l-md" 
                  : "border-transparent text-emerald-100/50 hover:bg-emerald-500/5 hover:text-white rounded-md"
              }`}
            >
              <Compass className="w-4 h-4 opacity-80" /> <span>Home View</span>
            </button>

            <button 
              onClick={() => { setCurrentView("directory"); setSelectedCategory("all"); setSelectedToolId(null); }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium font-sans border-r-2 transition-all cursor-pointer ${
                currentView === "directory" && selectedCategory === "all"
                  ? "bg-emerald-500/10 border-[#00ff88] text-[#00ff88] rounded-l-md" 
                  : "border-transparent text-emerald-100/50 hover:bg-emerald-500/5 hover:text-white rounded-md"
              }`}
            >
              <Sliders className="w-4 h-4 opacity-80" /> <span>Tools Directory</span>
            </button>

            <button 
              onClick={() => { setCurrentView("directory"); setSelectedCategory("all"); }}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-emerald-100/50 hover:text-white hover:bg-emerald-500/5 rounded-md border border-transparent transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 opacity-80" /> <span>Saved Favorites</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-500/50">{favorites.length}</span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-emerald-500/10 pt-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 font-bold ml-1 mb-2">Categories Depot</span>
            
            {CATEGORIES.map((cat) => {
              const active = currentView === "directory" && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setCurrentView("directory"); setSelectedToolId(null); }}
                  className={`flex items-center justify-between px-3 py-1.5 text-xs font-sans border-r-2 transition-all cursor-pointer ${
                    active 
                      ? "bg-emerald-500/10 border-[#00ff88] text-[#00ff88] rounded-l-md" 
                      : "border-transparent text-emerald-100/50 hover:text-white hover:bg-emerald-500/5 rounded-md"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <SmartIcon name={cat.iconName} className="w-3.5 h-3.5 opacity-80" />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-500/50">{cat.count}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* System Status Widget */}
        <div className="p-4 bg-black/30 rounded-xl border border-emerald-500/10 mt-auto">
          <p className="text-[10px] text-[#00ff88] font-bold uppercase tracking-widest mb-1">System Status</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-100/60">Offline Ready</span>
            <div className="w-2 h-2 bg-[#00ff88] rounded-full shadow-[0_0_8px_#00ff88]"></div>
          </div>
          <div className="mt-3 h-1 w-full bg-emerald-990 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-[#00ff88] rounded-full shadow-[0_0_10px_#00ff88]"></div>
          </div>
        </div>

        {/* Go Premium Teaser widget Card */}
        <div className="bg-gradient-to-br from-[#0c1310]/50 to-transparent border border-emerald-500/10 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-cyber-green/5 blur-xl pointer-events-none" />
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyber-green" />
            <span className="font-display font-bold text-xs tracking-wide text-white uppercase">Go Premium</span>
          </div>
          <p className="text-[10px] text-emerald-100/40 font-sans leading-relaxed">
            Unlock professional custom API proxies and cloud database synchronization hooks.
          </p>
          <button 
            onClick={() => showToast("Premium Module coming soon!", "info")}
            className="w-full py-1.5 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] font-semibold text-[10px] uppercase tracking-wider hover:bg-[#00ff88]/20 transition-all cursor-pointer"
          >
            Upgrade Deck
          </button>
        </div>

        {/* Sidebar control footer icons */}
        <div className="flex items-center justify-between border-t border-emerald-500/10 pt-4 font-mono text-[10px] text-emerald-100/30">
          <button onClick={() => showToast("Settings console opened", "info")} className="hover:text-cyber-green flex items-center gap-1 cursor-pointer">
            <Settings className="w-3.5 h-3.5 text-emerald-500/60" /> <span>Settings</span>
          </button>
          
          <button onClick={() => setCurrentView("about")} className="hover:text-cyber-green flex items-center gap-1 cursor-pointer">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500/60" /> <span>Help</span>
          </button>
        </div>

      </aside>

      {/* =========================================================
          MAIN APPLICATION CONTAINER COCKPIT
         ========================================================= */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen relative z-10">
        
        {/* =========================================================
            TOP HEADER NAVIGATION
           ========================================================= */}
        <header className="h-16 border-b border-emerald-500/10 bg-[#08110d]/40 backdrop-blur-md px-6 flex items-center justify-between select-none relative z-10 shrink-0">
          
          {/* Breadcrumb locator indicator */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded bg-black/60 border border-emerald-500/10 text-[#00ff88] hover:text-white mr-1 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            <span className="font-mono text-[10px] text-emerald-500/80 tracking-widest uppercase">PHORGE_TOOLS</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500/30" />
            <span className="font-sans text-xs text-white capitalize font-semibold tracking-wide">
              {currentView === "tool" ? selectedTool.name : currentView}
            </span>
          </div>

          {/* Desktop inline Navigation tabs links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-emerald-100/60 font-medium font-sans">
            {[
              { id: "home", label: "Home" },
              { id: "directory", label: "All Tools" },
              { id: "about", label: "About" },
              { id: "contact", label: "Contact" },
              { id: "install", label: "Install App" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentView(tab.id as any);
                  if (tab.id === "directory") setSelectedCategory("all");
                  setSelectedToolId(null);
                }}
                className={`transition-colors relative py-1 hover:text-white cursor-pointer ${
                  currentView === tab.id ? "text-[#00ff88] font-semibold" : ""
                }`}
              >
                {tab.label}
                {currentView === tab.id && (
                  <span className="absolute bottom-[-14px] inset-x-0 h-[2px] bg-[#00ff88] shadow-[0_0_15px_#00ff88]" />
                )}
              </button>
            ))}
          </nav>

          {/* Header Action nodes */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => showToast("Dial calibrator active", "info")}
              className="p-2 rounded-xl bg-black border border-emerald-500/10 hover:border-[#00ff88]/20 text-emerald-500/60 hover:text-cyber-green transition-colors cursor-pointer"
              title="Calibration power dial"
            >
              <Activity className="w-4 h-4" />
            </button>

            <button 
              onClick={() => { setCurrentView("install"); setSelectedToolId(null); }}
              className="px-4 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full text-[#00ff88] text-xs font-bold hover:bg-[#00ff88]/20 transition-all uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,136,0.2)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Install PWA</span>
            </button>
          </div>

        </header>

        {/* =========================================================
            MOBILE SLIDEOUT SIDEBAR DRAWER
           ========================================================= */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setMobileSidebarOpen(false)} />
            <div className="relative w-64 bg-[#080d0a] border-r border-[#0d1c13] p-5 flex flex-col gap-5 select-none z-10 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="font-display font-bold text-sm tracking-widest text-[#00ff88]">PHORGE PLATFORM</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 text-xs text-zinc-400">
                <button 
                  onClick={() => { setCurrentView("home"); setSelectedToolId(null); setMobileSidebarOpen(false); }}
                  className="px-3 py-2 rounded-lg bg-white/5 text-white text-left font-sans"
                >
                  Home Screen
                </button>
                <button 
                  onClick={() => { setCurrentView("directory"); setSelectedCategory("all"); setSelectedToolId(null); setMobileSidebarOpen(false); }}
                  className="px-3 py-2 rounded-lg text-left"
                >
                  Tools Index Directory
                </button>
              </div>

              <div className="flex flex-col gap-1 border-t border-white/5 pt-4 overflow-y-auto">
                <span className="text-[10px] font-mono text-zinc-600 block mb-2 tracking-widest">CATEGORIES</span>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setCurrentView("directory"); setSelectedToolId(null); setMobileSidebarOpen(false); }}
                    className="flex justify-between items-center px-2 py-1.5 text-zinc-400 hover:text-white"
                  >
                    <span className="text-xs">{cat.name}</span>
                    <span className="font-mono text-[9px] text-zinc-600">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SCROLLABLE APPLICATION ACTIVE SPACE
           ========================================================= */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">

          {/* ==========================================
              1. VIEWPORT: HOME PAGE
             ========================================== */}
          {currentView === "home" && (
            <div className="w-full flex flex-col gap-8">
              
              {/* Home Cockpit Layout: Left Section (Hero + Popular Grid) & Right Panel (Quick Access + Sparkline CPU) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                
                {/* Left 2 Column Blocks */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                  
                  {/* Cinematic Hero */}
                  <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0c1511]/40 to-transparent border border-emerald-500/10 cyber-glow relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                    <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-[#00ff88]/5 to-transparent blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10">
                      <span className="px-3 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] font-mono text-[9px] tracking-widest uppercase inline-block">
                        🛰️ 100% OFFLINE DATA PROCESS
                      </span>
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mt-4 uppercase italic">
                        100+ POWERFUL TOOLS.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00d26a]">FULLY OFFLINE.</span>
                      </h2>
                      <p className="text-emerald-100/40 text-sm md:text-base max-w-lg mt-3 leading-relaxed font-light">
                        All tools work secure within your browser frame memory. No databases, registration or API connections needed. Private, swift, and futuristic utility platform for the modern explorer.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3.5 mt-6 relative z-10">
                      <button 
                        onClick={() => { setCurrentView("directory"); setSelectedCategory("all"); }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d26a] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:opacity-90 flex items-center gap-2 cursor-pointer"
                      >
                        Explore Tools Directory <ChevronRight className="w-4 h-4 text-black" />
                      </button>
                      <button 
                        onClick={() => { setCurrentView("about"); }}
                        className="px-5 py-3 rounded-xl bg-[#08110d]/40 hover:bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] font-bold text-xs transition-colors cursor-pointer"
                      >
                        How It Works
                      </button>
                    </div>

                    {/* Minimal decorative trust metrics */}
                    <div className="border-t border-emerald-500/10 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 text-[10px] font-mono text-emerald-100/30 uppercase tracking-wider">
                      <span>✓ CERTIFIED CLIENT SANDBOX</span>
                      <span>SHARED SECURELY BY: Sirajul Islam Rubel</span>
                    </div>
                  </div>

                  {/* HIGH PERFORMANCE 3D EXPERIMENT CUBE PANEL */}
                  <div className="flex flex-col gap-3">
                    <div className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">3D INTERACTIVE MATRICES COCKPIT</div>
                    <VirtualCube />
                  </div>

                  {/* POPULAR TOOLS GRID LIST AREA */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
                      <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">POPULAR SPOTLIGHT WORKSPACES</span>
                      <button 
                        onClick={() => { setCurrentView("directory"); setSelectedCategory("all"); }}
                        className="text-[10px] font-mono text-cyber-green hover:underline uppercase font-bold cursor-pointer"
                      >
                        View All Tools ➔
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {popularTools.map((t) => (
                        <div 
                          key={t.id}
                          onClick={() => handleOpenTool(t.id)}
                          className="p-6 bg-gradient-to-br from-[#0f1721]/80 to-transparent border border-emerald-500/10 rounded-2xl flex flex-col justify-between hover:border-[#00ff88]/40 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-cyber-green/5 blur-xl group-hover:bg-[#00ff88]/10 transition-all pointer-events-none" />
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-emerald-500/10 border border-[#00ff88]/20 rounded-xl mb-4 flex items-center justify-center text-[#00ff88] group-hover:scale-110 transition-all duration-300">
                              <SmartIcon name={t.iconName} className="w-6 h-6" />
                            </div>
                            <span className="text-[8px] font-mono text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.5 rounded border border-[#00ff88]/20 tracking-wider uppercase">TREND</span>
                          </div>
                          <div className="mt-2">
                            <h4 className="font-display font-medium text-white text-base tracking-tight group-hover:text-cyber-green transition-colors">{t.name}</h4>
                            <p className="text-emerald-100/40 text-xs leading-relaxed mt-1 line-clamp-2">{t.description}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-emerald-500/5 flex justify-between items-center text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">
                            <span>Developer</span>
                            <span className="text-[#00ff88] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right 1 Column Block (Quick Access, Installer widget, Sparkline wave) */}
                <div className="col-span-1 flex flex-col gap-6">
                  
                  {/* Quick Access List */}
                  <div className="p-5 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10 backdrop-blur-sm flex flex-col gap-4">
                    <div>
                      <h4 className="font-display font-semibold text-white text-sm">Quick Access</h4>
                      <p className="text-emerald-500 text-[10px] font-mono mt-0.5 tracking-wider">YOUR MOST RECENT & FREQUENT TOOLS</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {quickAccessList.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleOpenTool(item.id)}
                          className="flex items-center justify-between p-3 rounded-xl bg-black/40 hover:bg-[#112319]/45 border border-emerald-500/5 hover:border-[#00ff88]/25 text-left transition-all group cursor-pointer"
                        >
                          <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">{item.name}</span>
                          <ChevronRight className="w-4 h-4 text-emerald-500/40 group-hover:text-cyber-green group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real-time System Wave indicator */}
                  <div className="p-5 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-100/30 block uppercase tracking-wider">Local Cognitive Load</span>
                        <span className="text-xs font-semibold text-white mt-1 block flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" /> All Systems Operational
                        </span>
                      </div>
                      <span className="font-mono text-xs text-cyber-green bg-[#00ff88]/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">60FPS</span>
                    </div>

                    {/* Simulated live SVG wave path */}
                    <div className="h-12 w-full mt-2 relative overflow-hidden">
                      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-[#00ff88] stroke-current fill-none">
                        <path 
                          d="M0 15 Q25 5 50 15 T100 15" 
                          strokeWidth="1.5" 
                          className="animate-pulse"
                          style={{ animationDuration: "1.5s" }}
                        />
                        <path 
                          d="M0 15 Q20 25 40 10 T80 20 T100 15" 
                          strokeWidth="0.5" 
                          strokeOpacity="0.4"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Why Choose Platform blocks */}
                  <div className="p-5 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10 flex flex-col gap-4">
                    <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">Core Specifications:</span>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded bg-[#00ff88]/10 text-cyber-green mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h5 className="font-display font-semibold text-white text-xs">Offline Isolation</h5>
                        <p className="text-emerald-100/40 text-[10px] mt-0.5 leading-relaxed">Runs in browser RAM, safe from intercept routers.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-emerald-500/10 pt-3">
                      <div className="p-1.5 rounded bg-[#00ff88]/10 text-cyber-green mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h5 className="font-display font-semibold text-white text-xs">Zero API latency</h5>
                        <p className="text-emerald-100/40 text-[10px] mt-0.5 leading-relaxed">Instant transforms under microsecond compiler indices.</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* CORE WHY TRUST PHORGE CORE COCKPIT BENEFITS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-[#0c1511]/20 to-transparent p-6 rounded-2xl border border-emerald-500/10">
                <div>
                  <h3 className="font-display font-bold text-lg text-white uppercase italic">Why trust PHORGE utility cores?</h3>
                  <p className="text-emerald-100/40 text-xs mt-1 leading-relaxed">
                    Under Web Cryptography standard guidelines, all variable manipulation, string sorting, formatting and code beautify modules are engineered to behave in physical browser isolation. Neither tracker beacons nor analytic coordinates are integrated. Perfect compliance for developers and financial audits.
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <div className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">LOCAL COMPLIANCE SCORES:</div>
                  <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg text-xs font-mono border border-emerald-500/5">
                    <span className="text-zinc-450">DATA PRIVACY LEAK</span>
                    <span className="text-red-400 font-bold">0.00% LEVEL</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg text-xs font-mono border border-emerald-500/5">
                    <span className="text-zinc-450 font-medium">BROWSER ISOLATION</span>
                    <span className="text-[#00ff88] font-bold">100% SECURE</span>
                  </div>
                </div>
              </div>

              {/* FAQ accordions */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">FREQUENCY SYSTEMS FAQ</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {systemFaqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#08110e]/40 border border-emerald-500/10 hover:border-[#00ff88]/20 transition-all duration-300">
                      <h4 className="font-display font-semibold text-xs text-white">Q: {faq.q}</h4>
                      <p className="text-[11px] text-emerald-100/40 leading-relaxed mt-2">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              2. VIEWPORT: TOOLS DIRECTORY VIEW
             ========================================== */}
          {currentView === "directory" && (
            <div className="w-full flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-semibold text-white uppercase tracking-tight italic">PHORGE TOOLS DEPOT</h2>
                  <p className="text-emerald-100/40 text-[10px] font-mono mt-1 uppercase">125 CORE PIPELINE UTILITIES READY FOR RUNTIME</p>
                </div>

                {/* Direct category selects */}
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase border transition-colors cursor-pointer ${
                      selectedCategory === "all" 
                        ? "bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]" 
                        : "bg-black/40 border-emerald-500/10 hover:border-[#00ff88]/20 text-emerald-100/50"
                    }`}
                  >
                    All Pipelines
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase border transition-colors cursor-pointer ${
                        selectedCategory === cat.id 
                          ? "bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]" 
                          : "bg-black/40 border-emerald-500/10 hover:border-[#00ff88]/20 text-emerald-100/50"
                      }`}
                    >
                      {cat.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live search input bar filter */}
              <div className="flex items-center gap-3 bg-[#0d1612]/30 p-4 rounded-2xl border border-emerald-500/10 focus-within:border-[#00ff88]/30 transition-all">
                <Search className="w-5 h-5 text-emerald-500/85 animate-pulse" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type parameters to search in 125 tools library (e.g. text, crypt, bmi)..."
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-[#00ff88]/25 text-sm font-sans"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-emerald-500 hover:text-white font-mono text-xs cursor-pointer">Clear Filter</button>
                )}
              </div>

              {/* Grid of Results tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTools.map((t) => {
                  const isFav = favorites.includes(t.id);
                  return (
                    <div 
                      key={t.id}
                      className="p-5 bg-gradient-to-br from-[#0f1721]/80 to-transparent border border-emerald-500/10 rounded-2xl flex flex-col justify-between hover:border-[#00ff88]/40 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                      onClick={() => handleOpenTool(t.id)}
                    >
                      <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-[#00ff88]/5 blur-xl group-hover:bg-[#00ff88]/10 transition-colors pointer-events-none" />
                      
                      <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-emerald-500/10 border border-[#00ff88]/20 text-[#00ff88] rounded-xl group-hover:scale-105 transition-all">
                          <SmartIcon name={t.iconName} className="w-4.5 h-4.5" />
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isFav ? "bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]" : "bg-[#0b100d] border border-emerald-500/10 text-emerald-500/40 hover:text-white"
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      <div className="mt-5">
                        <h4 className="font-display font-semibold text-white text-sm group-hover:text-[#00ff88] transition-colors">{t.name}</h4>
                        <p className="text-emerald-100/40 text-xs leading-relaxed mt-1 line-clamp-3 font-light">{t.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[10px] font-mono text-[#00ff88]/60">
                        <span className="uppercase text-[9px] tracking-wider px-2 py-0.5 rounded bg-black/60 border border-emerald-500/5">{t.category}</span>
                        <button 
                          onClick={() => handleOpenTool(t.id)} 
                          className="text-[#00ff88] font-bold hover:underline flex items-center gap-1 opacity-80 group-hover:opacity-100 cursor-pointer"
                        >
                          Launch ➔
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-12 bg-black/20 rounded-2xl border border-emerald-500/10 font-mono text-emerald-100/30 text-xs">
                  No core utilities matched your parameter variables in this filter branch.
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              3. VIEWPORT: DYNAMIC TOOL PAGE TEMPLATE
             ========================================== */}
          {currentView === "tool" && selectedTool && (
            <ToolWorkspace 
              tool={selectedTool} 
              isFavorite={favorites.includes(selectedTool.id)}
              onToggleFavorite={() => toggleFavorite(selectedTool.id)}
              onRecordUsage={() => recordUsage(selectedTool.id)}
            />
          )}

          {/* ==========================================
              4. VIEWPORT: ABOUT PAGE
             ========================================== */}
          {currentView === "about" && (
            <div className="w-full flex flex-col gap-8 max-w-4xl mx-auto">
              
              <div className="p-8 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10 relative overflow-hidden text-center flex flex-col items-center gap-4">
                <div className="absolute top-0 right-0 w-[200px] h-full pointer-events-none bg-gradient-to-l from-emerald-500/5 to-transparent blur-xl" />
                <Sparkle className="w-8 h-8 text-cyber-green animate-bounce" />
                <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white uppercase italic">About the PHORGE Project</h2>
                <p className="text-emerald-100/40 text-sm leading-relaxed max-w-xl font-light">
                  PHORGE was born out of an engineering vision to build a flawless, fully standalone developer cockpit and utility platform that can run isolated. By eliminating reliance on heavy database hosts or tracking beacons, we offer premium operations.
                </p>
                <div className="flex gap-4 mt-2">
                  <div className="p-4 bg-black/40 rounded-xl text-center border border-emerald-500/10 shrink-0">
                    <span className="text-[10px] font-mono text-emerald-500/60 uppercase block">Total Utilities</span>
                    <span className="text-xl font-display font-extrabold text-[#00ff88] block mt-1">125 CORES</span>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl text-center border border-emerald-500/10 shrink-0">
                    <span className="text-[10px] font-mono text-emerald-500/60 uppercase block">Sync Latency</span>
                    <span className="text-xl font-display font-extrabold text-[#00ff88] block mt-1">0.00 MS</span>
                  </div>
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono text-emerald-500 font-bold uppercase tracking-widest block mb-1">DEVELOPMENT HORIZONS TIMELINE</span>
                
                <div className="flex gap-4">
                  <div className="font-mono text-xs text-[#00ff88] shrink-0 pt-0.5">2026_Q2</div>
                  <div className="p-4 bg-[#0d1612]/35 rounded-xl border border-emerald-500/10 flex-1">
                    <h4 className="font-display font-semibold text-white text-xs">Phorge Platform 125 pipeline update</h4>
                    <p className="text-emerald-100/40 text-[11px] leading-relaxed mt-1">Deployed offline-first compilation layers and modular PWA caching strategies.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="font-mono text-xs text-emerald-500/50 shrink-0 pt-0.5">2026_Q1</div>
                  <div className="p-4 bg-[#0d1612]/15 rounded-xl border border-emerald-500/10 flex-1">
                    <h4 className="font-display font-semibold text-emerald-100/60 text-xs">Core Cryptographic Local Shift formulas</h4>
                    <p className="text-emerald-100/40 text-[11px] leading-relaxed mt-1">Integrated advanced local string converters and mathematical polynomial formulas.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              5. VIEWPORT: CONTACT PAGE
             ========================================== */}
          {currentView === "contact" && (
            <div className="w-full max-w-xl mx-auto">
              
              <div className="p-6 md:p-8 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10 flex flex-col gap-5">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-white uppercase italic tracking-tight">Contact Terminal</h2>
                  <p className="text-emerald-100/40 text-[10px] font-mono mt-0.5 uppercase tracking-wide">SUBMIT TICKET PACKETS ON LOCAL CONSOLE ROUTERS</p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Contact ticket dispatched locally!", "success");
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-emerald-500 uppercase font-bold">Operator Alias Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="sirajul.islam.rubel09@gmail.com" 
                      className="w-full bg-black/60 border border-emerald-500/10 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none focus:border-[#00ff88]/30 focus:ring-1 focus:ring-[#00ff88]/10" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-emerald-500 uppercase font-bold">Support Vector Category</label>
                    <select className="w-full bg-black/60 border border-emerald-500/10 rounded-xl px-4 py-2.5 text-emerald-100/40 text-xs focus:outline-none focus:border-[#00ff88]/30">
                      <option>Pipeline Bug / Error Logs</option>
                      <option>Feature Recommendation Request</option>
                      <option>Academic or Enterprise inquiries</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-emerald-500 uppercase font-bold">Message lines</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Type details..." 
                      className="w-full bg-black/60 border border-emerald-500/10 rounded-xl p-4 text-zinc-200 text-xs focus:outline-none focus:border-[#00ff88]/30 focus:ring-1 focus:ring-[#00ff88]/10 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/20 font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)] mt-2 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch Secure Packet
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ==========================================
              6. VIEWPORT: PRIVACY POLICY
             ========================================== */}
          {currentView === "privacy" && (
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
              <div className="p-6 md:p-8 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10">
                <h2 className="text-xl md:text-2xl font-display font-semibold text-white uppercase italic">Privacy compliance guidelines</h2>
                <div className="text-emerald-500 text-[10px] font-mono mt-1 mb-4 uppercase tracking-widest">SECURE OFFLINE ISOLATION DATA AUDIT</div>
                
                <p className="text-emerald-100/40 text-xs md:text-sm leading-relaxed mb-4 font-light">
                  All local variables, images loaded, JSON parse segments, and scientific calculators processed in standard memory run on your sandboxed device thread frame. Absolutely zero network sockets are created to external servers. No telemetry statistics or telemetry registries are maintained.
                </p>

                <h4 className="font-display font-semibold text-[#00ff88] text-xs md:text-sm mt-4">Local Cookies & Cache compliance</h4>
                <p className="text-emerald-100/40 text-xs leading-relaxed mt-2 font-light">
                  Our system utilizes local Service Worker offline cache configurations to store assets offline. LocalStorage is uniquely requested to preserve favorites lists persistent. You can clear this anytime using Chrome settings with absolutely zero data footprints.
                </p>
              </div>
            </div>
          )}

          {/* ==========================================
              7. VIEWPORT: TERMS OF USE
             ========================================== */}
          {currentView === "terms" && (
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
              <div className="p-6 md:p-8 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10">
                <h2 className="text-xl md:text-2xl font-display font-semibold text-white uppercase italic">Terms of local service</h2>
                <div className="text-emerald-500 text-[10px] font-mono mt-1 mb-4 uppercase tracking-widest">CLIENT LICENSE BOUNDS</div>
                
                <p className="text-emerald-100/40 text-xs md:text-sm leading-relaxed mb-4 font-light">
                  PHORGE is provided completely free of licensing charges under Apache-2.0 open-source terms. The user retains complete custody, copyrights and liability parameters regarding string outputs, QR vectors or invoices compiled. Standard diagnostic indicators or results can be used for financial and personal audits seamlessly.
                </p>
              </div>
            </div>
          )}

          {/* ==========================================
              8. VIEWPORT: INSTALL PAGE
             ========================================== */}
          {currentView === "install" && (
            <div className="w-full max-w-xl mx-auto">
              
              <div className="p-6 md:p-8 rounded-2xl bg-[#08110e]/40 border border-emerald-500/10 text-center flex flex-col items-center gap-4">
                <AppWindow className="w-8 h-8 text-cyber-green animate-pulse" />
                <h2 className="text-xl md:text-2xl font-display font-bold text-white uppercase italic">Save PWA standalone App</h2>
                <p className="text-emerald-100/40 text-xs leading-relaxed font-light">
                  Setup PHORGE directly on your system workstation deck or mobile launcher utilizing local Service Worker caching frameworks. Ready for immediate flight-mode actions.
                </p>

                <div className="p-4 bg-black/40 rounded-lg border border-emerald-500/10 text-left w-full mt-2 flex flex-col gap-2 font-mono text-[11px] text-emerald-100/40">
                  <div className="flex justify-between">
                    <span>COFFEE_CACHE FILE SYSTEM</span>
                    <span className="text-cyber-green font-bold">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-500/15 pt-1.5 font-sans justify-between text-white text-xs">
                    <span>Standalone frame support:</span>
                    <span className="text-[#00ff88] font-mono text-[10px] font-bold">Verified Chrome, Edge & Safari</span>
                  </div>
                </div>

                <button 
                  onClick={() => showToast("Downloading package caches...", "success")}
                  className="px-5 py-2.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/20 font-semibold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,136,0.25)] flex items-center gap-1.5 mt-3 cursor-pointer uppercase tracking-widest"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" /> Launch standard download
                </button>
              </div>

            </div>
          )}

        </main>

        {/* ==========================================
            ELEGANT PLATFORM FOOTER LAYOUT
           ========================================== */}
        <footer className="border-t border-emerald-500/10 bg-[#08110d]/90 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-emerald-150 select-none shrink-0 relative z-10">
          <div className="flex items-center gap-2">
            <span>© 2026</span>
            <span className="text-[#00ff88] font-bold">PHORGE TOOLS INC</span>
            <span className="text-emerald-150">● Sirajul Islam Rubel</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView("privacy")} className="hover:text-[#00ff88] transition-colors cursor-pointer">Privacy policy</button>
            <button onClick={() => setCurrentView("terms")} className="hover:text-[#00ff88] transition-colors cursor-pointer">Terms of use</button>
            <button onClick={() => showToast("Local node: CL-RUN_3000", "info")} className="text-emerald-150 flex items-center gap-1 cursor-pointer">
              <Server className="w-3.5 h-3.5 text-emerald-500" /> CLOUD_RUN
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
