import React, { useState } from 'react';
import { X, PlusCircle, ArrowDownRight, ArrowUpRight, Tag, Calendar } from 'lucide-react';
import { TransactionType, Transaction } from '../types';
import { useCurrencyStore } from '../store/currencyStore';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES = {
  expense: [
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
  ],
  income: ['Salary', 'Freelance', 'Investments', 'Dividends', 'Business', 'Gifts', 'Other']
};

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const { currency } = useCurrencyStore();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    if (!description.trim()) return;

    onAdd({
      amount: parseFloat(amount),
      description: description.trim(),
      category,
      type,
      date: new Date(date).toISOString(),
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [category.toLowerCase()],
      notes: notes.trim()
    });

    // Reset & close
    setAmount('');
    setDescription('');
    setTags('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-card">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Record Transaction</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/60 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Food & Dining');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Salary');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              Income
            </button>
          </div>

          {/* Amount & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full glass-input text-lg font-bold"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Date</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full glass-input"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Description / Payee
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Whole Foods Groceries, Tech Salary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input"
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-white/5">
              {CATEGORIES[type].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    category === cat
                      ? type === 'income'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                        : 'bg-rose-500 text-white font-bold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags & Optional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="tech, subscriptions..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Notes (optional)
              </label>
              <input
                type="text"
                placeholder="Additional memo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full glass-input text-xs"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-glow-emerald transition-all transform active:scale-98"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
