import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Sparkles,
  Receipt,
  PieChart,
  Target,
  Repeat,
  Settings,
  Plus,
  Globe,
  RotateCcw,
  X
} from 'lucide-react';
import { useCurrencyStore, CURRENCIES } from '../../store/currencyStore';
import { CurrencyCode } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenQuickAdd: () => void;
  onResetData: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenQuickAdd,
  onResetData
}) => {
  const [query, setQuery] = useState('');
  const { setCurrency } = useCurrencyStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      title: 'Go to Overview Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      run: () => {
        onNavigate('dashboard');
        onClose();
      }
    },
    {
      title: 'Go to Analytics & AI Forecasting',
      category: 'Navigation',
      icon: Sparkles,
      run: () => {
        onNavigate('analytics');
        onClose();
      }
    },
    {
      title: 'Go to Transactions Ledger',
      category: 'Navigation',
      icon: Receipt,
      run: () => {
        onNavigate('transactions');
        onClose();
      }
    },
    {
      title: 'Go to Budgets & Spending Limits',
      category: 'Navigation',
      icon: PieChart,
      run: () => {
        onNavigate('budgets');
        onClose();
      }
    },
    {
      title: 'Go to Savings Goals',
      category: 'Navigation',
      icon: Target,
      run: () => {
        onNavigate('savings');
        onClose();
      }
    },
    {
      title: 'Go to Subscriptions & Recurring Bills',
      category: 'Navigation',
      icon: Repeat,
      run: () => {
        onNavigate('recurring');
        onClose();
      }
    },
    {
      title: 'Go to Settings',
      category: 'Navigation',
      icon: Settings,
      run: () => {
        onNavigate('settings');
        onClose();
      }
    },
    {
      title: 'Add New Transaction / Income Entry',
      category: 'Quick Actions',
      icon: Plus,
      run: () => {
        onClose();
        onOpenQuickAdd();
      }
    },
    {
      title: 'Switch Currency to USD ($)',
      category: 'Preferences',
      icon: Globe,
      run: () => {
        setCurrency('USD');
        onClose();
      }
    },
    {
      title: 'Switch Currency to EUR (€)',
      category: 'Preferences',
      icon: Globe,
      run: () => {
        setCurrency('EUR');
        onClose();
      }
    },
    {
      title: 'Switch Currency to INR (₹)',
      category: 'Preferences',
      icon: Globe,
      run: () => {
        setCurrency('INR');
        onClose();
      }
    },
    {
      title: 'Switch Currency to GBP (£)',
      category: 'Preferences',
      icon: Globe,
      run: () => {
        setCurrency('GBP');
        onClose();
      }
    },
    {
      title: 'Reset to Pristine Demo State',
      category: 'System',
      icon: RotateCcw,
      run: () => {
        onResetData();
        onClose();
      }
    }
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-card">
        {/* Search input header */}
        <div className="flex items-center px-4 border-b border-white/10">
          <Search className="w-5 h-5 text-emerald-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full py-4 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No matching commands or actions found.
            </div>
          ) : (
            filtered.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.run}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{action.title}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-emerald-400/80">
                    {action.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-t border-white/5 text-[11px] text-slate-400">
          <span>Navigate with mouse or shortcuts</span>
          <div className="flex items-center gap-2">
            <span>[ESC] to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
