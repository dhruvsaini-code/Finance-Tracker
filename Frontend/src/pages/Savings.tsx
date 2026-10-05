import React, { useState } from 'react';
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  DollarSign,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal } from '../types';
import { useCurrencyStore } from '../store/currencyStore';

interface SavingsProps {
  goals: SavingsGoal[];
  onSaveGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onContributeGoal: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export const Savings: React.FC<SavingsProps> = ({
  goals,
  onSaveGoal,
  onContributeGoal,
  onDeleteGoal
}) => {
  const { formatAmount } = useCurrencyStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Safety');
  const [color, setColor] = useState('#10B981');

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeGoal || !contributeAmount || isNaN(Number(contributeAmount))) return;

    const amt = parseFloat(contributeAmount);
    onContributeGoal(contributeGoal.id || contributeGoal._id || '', amt);

    // Confetti effect!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setContributeGoal(null);
    setContributeAmount('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || isNaN(Number(targetAmount))) return;

    onSaveGoal({
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      targetDate: targetDate ? new Date(targetDate).toISOString() : new Date(Date.now() + 90 * 86400000).toISOString(),
      category,
      color,
      icon: 'Target'
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Savings Goals & Target Timelines
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Track capital allocation toward dream milestones, emergency funds, and asset acquisitions.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold shadow-glow-emerald transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Target Goal</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Goals Portfolio
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {formatAmount(totalSaved)}
              </span>
              <span className="text-sm text-slate-400 font-semibold">
                of {formatAmount(totalTarget)} Target Pool
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-400">{totalProgress}%</span>
            <span className="block text-xs text-slate-400 mt-0.5">
              {formatAmount(Math.max(0, totalTarget - totalSaved))} left to achieve 100%
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000"
            style={{ width: `${Math.min(100, totalProgress)}%` }}
          />
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {goals.map((g) => {
          const progress = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const isCompleted = g.currentAmount >= g.targetAmount || g.isCompleted;

          return (
            <div
              key={g.id || g._id}
              className="glass-card p-6 space-y-5 glass-card-hover relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                    style={{ backgroundColor: `${g.color}30`, border: `1px solid ${g.color}60` }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: g.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{g.name}</h3>
                    <span className="text-xs text-slate-400">{g.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <span className="badge-emerald flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                  <button
                    onClick={() => onDeleteGoal(g.id || g._id || '')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress & Amounts */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-2xl font-extrabold text-white">
                    {formatAmount(g.currentAmount)}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Target: {formatAmount(g.targetAmount)}
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: g.color || '#10B981'
                    }}
                  />
                </div>
              </div>

              {/* Card Footer: Deadline & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Due: {new Date(g.targetDate).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => setContributeGoal(g)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-400 font-bold text-xs shadow-sm hover:border-emerald-500/60 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deposit Funds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {contributeGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">
                Deposit to {contributeGoal.name}
              </h3>
              <button
                onClick={() => setContributeGoal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleContributeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Amount to Deposit
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="e.g. 250"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="w-full glass-input text-lg font-bold"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-glow-emerald transition-all"
              >
                Confirm Deposit 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add New Goal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl glass-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-bold text-white text-lg">Create Savings Milestone</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Milestone Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Stash, Vacation, Tesla..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Target Goal
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="e.g. 10000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Initial Deposit
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 1500"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full glass-input"
                  >
                    <option value="Safety">Safety & Reserve</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Travel">Travel & Leisure</option>
                    <option value="Tech">Tech & Gear</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="General">General Wealth</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-glow-emerald transition-all"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
