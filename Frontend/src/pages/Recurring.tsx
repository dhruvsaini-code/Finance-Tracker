import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Zap
} from 'lucide-react';
import { RecurringTransaction, TransactionType } from '../types';
import { useCurrencyStore } from '../store/currencyStore';

interface RecurringProps {
  recurring: RecurringTransaction[];
  onSaveRecurring: (item: Omit<RecurringTransaction, 'id'>) => void;
  onToggleActive: (id: string) => void;
  onDeleteRecurring: (id: string) => void;
}

export const Recurring: React.FC<RecurringProps> = ({
  recurring,
  onSaveRecurring,
  onToggleActive,
  onDeleteRecurring
}) => {
  const { formatAmount } = useCurrencyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Utilities & Subscriptions');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const monthlyOutflow = recurring
    .filter((r) => r.type === 'expense' && r.isActive)
    .reduce((sum, r) => sum + r.amount, 0);

  const monthlyInflow = recurring
    .filter((r) => r.type === 'income' && r.isActive)
    .reduce((sum, r) => sum + r.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || isNaN(Number(amount))) return;

    onSaveRecurring({
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      frequency,
      startDate: new Date().toISOString(),
      nextOccurrence: new Date(Date.now() + 30 * 86400000).toISOString(),
      isActive: true
    });

    setDescription('');
    setAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Repeat className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Subscriptions & Recurring Schedules
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Automated recurring bill schedules, payroll sync, and renewal warnings.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold shadow-glow-emerald transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Subscription</span>
        </button>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Scheduled Monthly Income
          </span>
          <div className="text-2xl font-extrabold text-emerald-400">
            +{formatAmount(monthlyInflow)}/mo
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {recurring.filter((r) => r.type === 'income' && r.isActive).length} active recurring deposits
          </span>
        </div>

        <div className="glass-card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Committed Recurring Expenses
          </span>
          <div className="text-2xl font-extrabold text-rose-400">
            -{formatAmount(monthlyOutflow)}/mo
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {recurring.filter((r) => r.type === 'expense' && r.isActive).length} active auto-pay commitments
          </span>
        </div>
      </div>

      {/* Recurring Cards Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Active Commitments</h3>
          <span className="badge-cyan">{recurring.length} Registered</span>
        </div>

        <div className="divide-y divide-white/5">
          {recurring.map((item) => {
            const isIncome = item.type === 'income';
            return (
              <div
                key={item.id || item._id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-3 rounded-xl border ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{item.description}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.frequency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        Next: {new Date(item.nextOccurrence).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <span
                      className={`text-base font-extrabold ${
                        isIncome ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatAmount(item.amount)}
                    </span>
                    <span className="block text-[11px] text-slate-500">per {item.frequency}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleActive(item.id || item._id || '')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        item.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => onDeleteRecurring(item.id || item._id || '')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl glass-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-bold text-white text-lg">Add Recurring Schedule</h3>
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
                  Description / Service
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Equinox Gym, Primary Salary..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full glass-input"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="w-full glass-input"
                  >
                    <option value="expense" className="bg-slate-900">Expense</option>
                    <option value="income" className="bg-slate-900">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Cadence / Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full glass-input"
                  >
                    <option value="daily" className="bg-slate-900">Daily</option>
                    <option value="weekly" className="bg-slate-900">Weekly</option>
                    <option value="monthly" className="bg-slate-900">Monthly</option>
                    <option value="yearly" className="bg-slate-900">Yearly</option>
                  </select>
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
                    <option value="Utilities & Subscriptions" className="bg-slate-900">Utilities</option>
                    <option value="Housing" className="bg-slate-900">Housing</option>
                    <option value="Health & Fitness" className="bg-slate-900">Health</option>
                    <option value="Salary" className="bg-slate-900">Salary</option>
                    <option value="Other" className="bg-slate-900">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-glow-emerald transition-all"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
