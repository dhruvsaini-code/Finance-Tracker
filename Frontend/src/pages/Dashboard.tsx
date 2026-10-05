import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart as PieIcon,
  Activity,
  Plus,
  ArrowRight,
  Receipt,
  Calendar,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Transaction, Budget, SavingsGoal, RecurringTransaction } from '../types';
import { useCurrencyStore } from '../store/currencyStore';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  recurring: RecurringTransaction[];
  onOpenQuickAdd: () => void;
  onNavigate: (tab: string) => void;
  onDeleteTransaction: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#3B82F6',
  'Food & Dining': '#F59E0B',
  Transportation: '#06B6D4',
  Shopping: '#EC4899',
  'Utilities & Subscriptions': '#8B5CF6',
  'Health & Fitness': '#10B981',
  Entertainment: '#F43F5E',
  Salary: '#10B981',
  Freelance: '#06B6D4',
  Investments: '#A855F7',
  Other: '#64748B'
};

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  budgets,
  goals,
  recurring,
  onOpenQuickAdd,
  onNavigate,
  onDeleteTransaction
}) => {
  const { formatAmount } = useCurrencyStore();
  const [chartRange, setChartRange] = useState<'6M' | '30D' | 'All'>('6M');

  // Compute Core Metrics
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0';

  // Category Breakdown for Pie Chart
  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  // Cash Flow Monthly Trends Sample Chart Data
  const monthlyFlowData = [
    { month: 'Nov', Income: 7200, Expenses: 3100, Net: 4100 },
    { month: 'Dec', Income: 8400, Expenses: 4200, Net: 4200 },
    { month: 'Jan', Income: 7800, Expenses: 3300, Net: 4500 },
    { month: 'Feb', Income: 8100, Expenses: 2900, Net: 5200 },
    { month: 'Mar', Income: 8500, Expenses: 3400, Net: 5100 },
    { month: 'Apr (Current)', Income: totalIncome || 8050, Expenses: totalExpense || 3200, Net: netSavings || 4850 }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Welcome & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time portfolio intelligence, expense metrics, and predictive insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('analytics')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-sm font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Insights</span>
          </button>
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold shadow-glow-emerald transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth / Surplus */}
        <div className="glass-card p-5 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Net Cash Surplus
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            <AnimatedCounter value={netSavings} prefix={formatAmount(0).charAt(0)} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Total Inflow */}
        <div className="glass-card p-5 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Inflow / Income
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            <AnimatedCounter value={totalIncome} prefix={formatAmount(0).charAt(0)} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
            <span>{transactions.filter((t) => t.type === 'income').length} active sources</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-card p-5 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Outflow / Expense
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            <AnimatedCounter value={totalExpense} prefix={formatAmount(0).charAt(0)} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-4.2% below budget ceiling</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="glass-card p-5 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Savings Solvency Rate
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {savingsRate}%
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, Number(savingsRate)))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Visuals Section: Cash Flow Area Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Cash Flow Dynamics & Net Retention
              </h3>
              <p className="text-xs text-slate-400">
                Monthly income vs expense trajectories over time
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-white/5">
              {(['6M', '30D', 'All'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartRange === range
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatAmount(Number(val)), '']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Income"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="Expenses"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Expense Doughnut */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-400" />
              Expense by Category
            </h3>
            <p className="text-xs text-slate-400">Current allocation distribution</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.name] || '#64748B'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatAmount(Number(val)), '']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Total Spent</span>
              <span className="text-sm font-extrabold text-white">
                {formatAmount(totalExpense, false)}
              </span>
            </div>
          </div>

          {/* Top 3 Category Progress Bars */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            {pieData.slice(0, 3).map((item) => {
              const pct = totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="text-slate-400">
                      {formatAmount(item.value)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_COLORS[item.name] || '#10B981'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Transactions Feed & Active Goals Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Feed */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5 overflow-hidden rounded-xl bg-slate-950/40 border border-white/5">
            {transactions.slice(0, 5).map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id || tx._id}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-900/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-100 group-hover:text-white transition-colors">
                        {tx.description}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="px-1.5 py-0.2 bg-slate-800 rounded text-[11px] text-slate-300">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-bold text-sm ${
                        isIncome ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatAmount(tx.amount)}
                    </div>
                    <button
                      onClick={() => onDeleteTransaction(tx.id || tx._id || '')}
                      className="text-[11px] text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Savings Goals Snapshot */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Target Milestones</h3>
            </div>
            <button
              onClick={() => onNavigate('savings')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {goals.slice(0, 3).map((goal) => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div
                  key={goal.id || goal._id}
                  className="p-3 rounded-xl bg-slate-950/40 border border-white/5 space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{goal.name}</span>
                    <span className="text-emerald-400 font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: goal.color || '#10B981'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{formatAmount(goal.currentAmount)} saved</span>
                    <span>Target: {formatAmount(goal.targetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('savings')}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-300 transition-colors"
            >
              + Add Target Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
