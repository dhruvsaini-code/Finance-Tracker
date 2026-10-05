import React from 'react';
import {
  Wallet,
  Sparkles,
  Command,
  Plus,
  Globe,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { useCurrencyStore, CURRENCIES } from '../store/currencyStore';
import { CurrencyCode } from '../types';

interface NavbarProps {
  onOpenQuickAdd: () => void;
  onOpenCommandPalette: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickAdd,
  onOpenCommandPalette,
  activeTab,
  setActiveTab
}) => {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090D16]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-glow-emerald flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Finance<span className="text-emerald-400">SaaS</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                AI Pro
              </span>
            </div>
          </div>
        </div>

        {/* Global Search & Command Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-sm transition-all group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Command className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Search actions, ledgers, budgets...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono bg-slate-800/80 border border-slate-700 text-slate-400 rounded-md">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Currency Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-slate-300 text-sm font-medium transition-all cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currency}</span>
              <span className="text-xs text-slate-500">({CURRENCIES[currency].symbol})</span>
            </div>

            <div className="absolute right-0 mt-2 w-44 p-1.5 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Select Currency
              </div>
              {Object.values(CURRENCIES).map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code as CurrencyCode)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    currency === c.code
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>
                    {c.symbol} {c.code}
                  </span>
                  <span className="text-[11px] text-slate-500">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-emerald transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Entry</span>
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md border border-white/20">
              DS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
