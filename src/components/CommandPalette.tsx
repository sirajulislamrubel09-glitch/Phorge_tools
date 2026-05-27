/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Terminal, X } from "lucide-react";
import { ToolItem } from "../types";
import { TOOLS } from "../data/tools";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectTool }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input automatically upon opening
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Global shortcut triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Search logic matching title, description or tags
  const filtered = TOOLS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 8); // Top 8 relative matches

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectTool(filtered[selectedIndex].id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#030604]/80 backdrop-blur-md">
      {/* Click outside backdrop close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main command palette search dialog */}
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-[#08110e] border border-cyber-green/20 shadow-[0_0_50px_rgba(0,255,136,0.15)] overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-[#0b1612]">
          <Search className="w-5 h-5 text-cyber-green" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
            placeholder="Type tool name, category or tag (e.g. hash)..."
            className="flex-1 bg-transparent border-none text-white font-sans text-sm focus:outline-none placeholder-zinc-500"
          />
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/40 rounded text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length > 0 ? (
            filtered.map((tool, idx) => {
              const active = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => { onSelectTool(tool.id); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    active ? "bg-cyber-green/10 text-white border border-cyber-green/20" : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${active ? "bg-cyber-green/10 text-cyber-green animate-pulse" : "bg-black/60 text-zinc-500"}`}>
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-xs font-semibold block ${active ? "text-cyber-green" : "text-zinc-200"}`}>{tool.name}</span>
                      <span className="text-[10px] text-zinc-500 block truncate max-w-xs">{tool.description}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 font-mono text-[9px] select-none text-zinc-600">
                    <span className="px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 capitalize">{tool.category}</span>
                    {active && <span className="text-cyber-green">↵ enter</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 font-mono text-xs text-zinc-500">
              No diagnostic utilities matched your variable query string.
            </div>
          )}
        </div>

        {/* Console info footer drawer */}
        <div className="bg-[#040906] px-4 py-2.5 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-500 select-none">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to execute</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyber-green" /> <span>125 total tools offline index</span>
          </div>
        </div>

      </div>
    </div>
  );
}
