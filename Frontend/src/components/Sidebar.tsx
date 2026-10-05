import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  Target,
  Repeat,
  Sparkles,
  Receipt,
  Settings,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savingsRate?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savingsRate = 68.4
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics & AI', icon: Sparkles, badge: 'AI' },
    { id: 'transactions', label: 'Transactions Ledger', icon: Receipt },
    { id: 'budgets', label: 'Budgets & Limits', icon: PieChart },
    { id: 'savings', label: 'Savings Goals', icon: Target },
    { id: 'recurring', label: 'Subscriptions & Bills', icon: Repeat },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col justify-between py-6 px-4 border-r border-white/5 bg-[#090D16]/50 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase px-3 py-1 tracking-wider">
            Main Menu
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glow-emerald font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Financial Health Snippet */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-surface-100/90 to-surface-200/50 border border-white/10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-slate-300">Live Solvency Rate</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">{savingsRate}%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Optimal
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your cash surplus exceeds typical benchmarks by 2.4x.
          </p>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Local Engine Active</span>
        </div>
        <span>v2.4 Pro</span>
      </div>
    </aside>
  );
};
