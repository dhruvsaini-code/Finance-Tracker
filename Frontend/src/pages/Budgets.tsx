import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { Budget } from '../types';
import { useCurrencyStore } from '../store/currencyStore';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

interface BudgetsProps {
  budgets: Budget[];
  onSaveBudget: (budget: Partial<Budget>) => void;
  onDeleteBudget: (id: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Housing',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Utilities & Subscriptions',
  'Health & Fitness',
  'Entertainment',
  'Travel',
  'Education',
  'Other'
];

export const Budgets: React.FC<BudgetsProps> = ({
  budgets,
  onSaveBudget,
  onDeleteBudget
}) => {
  const { formatAmount } = useCurrencyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Partial<Budget> | null>(null);

  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [limit, setLimit] = useState('');
  const [warningThreshold, setWarningThreshold] = useState('80');

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setCategory(DEFAULT_CATEGORIES[0]);
    setLimit('');
    setWarningThreshold('80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Budget) => {
    setEditingBudget(b);
    setCategory(b.category);
    setLimit(b.limit.toString());
    setWarningThreshold(b.warningThresholdPercent.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || isNaN(Number(limit)) || Number(limit) <= 0) return;

    onSaveBudget({
      id: editingBudget?.id,
      category,
      limit: parseFloat(limit),
      warningThresholdPercent: parseInt(warningThreshold, 10) || 80,
      period: 'monthly'
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PieChart className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Budgets & Spending Limits
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Set guardrails, track category thresholds, and avert overspending.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold shadow-glow-emerald transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget Limit</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Monthly Budget Capacity
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                {formatAmount(totalSpent)}
              </span>
              <span className="text-sm text-slate-400 font-semibold">
                of {formatAmount(totalLimit)} Allocated
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xl font-black ${
                overallPct > 100
                  ? 'text-rose-400'
                  : overallPct > 80
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {overallPct}% Used
            </span>
            <span className="block text-xs text-slate-400 mt-0.5">
              {formatAmount(Math.max(0, totalLimit - totalSpent))} remaining
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              overallPct > 100
                ? 'bg-rose-500'
                : overallPct > 80
                ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${Math.min(100, overallPct)}%` }}
          />
        </div>
      </div>

      {/* Budget Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const isWarning = b.percentage >= b.warningThresholdPercent && b.percentage <= 100;
          const isDanger = b.percentage > 100;

          return (
            <div
              key={b.id || b._id}
              className={`glass-card p-5 space-y-4 relative overflow-hidden transition-all group ${
                isDanger
                  ? 'border-rose-500/40 shadow-glow-rose'
                  : isWarning
                  ? 'border-amber-500/30'
                  : 'glass-card-hover'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{b.category}</h3>
                  <span className="text-xs text-slate-400 capitalize">{b.period} Cycle</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteBudget(b.id || b._id || '')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1 text-sm font-semibold">
                  <span className="text-white font-extrabold">{formatAmount(b.spent)}</span>
                  <span className="text-slate-400 text-xs">Cap: {formatAmount(b.limit)}</span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isDanger
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, b.percentage)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                <span
                  className={`font-bold ${
                    isDanger
                      ? 'text-rose-400'
                      : isWarning
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {b.percentage}% Used
                </span>
                <span className="text-slate-400">
                  {isDanger
                    ? `Over by ${formatAmount(b.spent - b.limit)}`
                    : `${formatAmount(b.remaining)} left`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl glass-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-bold text-white text-lg">
                {editingBudget ? 'Edit Budget Cap' : 'Create Category Budget'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full glass-input"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Monthly Limit Amount
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="e.g. 500"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full glass-input text-lg font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Alert Warning Threshold ({warningThreshold}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-glow-emerald transition-all"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
