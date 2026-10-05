import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Database,
  RotateCcw,
  Shield,
  User,
  CheckCircle2,
  HardDrive,
  Moon,
  Sparkles
} from 'lucide-react';
import { useCurrencyStore, CURRENCIES } from '../store/currencyStore';
import { CurrencyCode } from '../types';

interface SettingsProps {
  onResetData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onResetData }) => {
  const { currency, setCurrency } = useCurrencyStore();
  const [userName, setUserName] = useState('Dhruv Saini');
  const [userEmail, setUserEmail] = useState('demo@example.com');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <SettingsIcon className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System & Portfolio Preferences
          </h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Customize base currencies, seed demo records, and configure security parameters.
        </p>
      </div>

      {/* Currency Settings */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">Global Base Currency</h3>
        </div>
        <p className="text-xs text-slate-400">
          All charts, ledgers, and forecasting models automatically update to your preferred currency.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {Object.values(CURRENCIES).map((c) => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code as CurrencyCode)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                currency === c.code
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-glow-emerald'
                  : 'bg-slate-900/60 text-slate-300 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="font-extrabold text-lg">{c.symbol} {c.code}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{c.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">User Profile & Account</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Account Email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full glass-input"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences updated
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data Reset & Engine State */}
      <div className="glass-card p-6 space-y-4 border-rose-500/20">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-rose-400" />
          <h3 className="font-bold text-white text-base">Data Management & Reset</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Restore initial realistic demonstration datasets including 12+ transactions, 6 category budgets, 4 savings milestones, and recurring subscription schedules.
        </p>

        <div className="pt-2">
          <button
            onClick={onResetData}
            className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Portfolio Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
