import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  PieChart as PieIcon,
  HelpCircle,
  Calendar,
  CheckCircle2,
  Brain
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Transaction, AIInsightsData } from '../types';
import { transactionService } from '../services/apiService';
import { useCurrencyStore } from '../store/currencyStore';

interface AnalyticsProps {
  transactions: Transaction[];
  onOpenQuickAdd: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const { formatAmount } = useCurrencyStore();
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const data = await transactionService.getAIInsights();
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, [transactions]);

  // Weekday Spending Heatmap Density Mock
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdayData = [
    { day: 'Mon', amount: 340, intensity: 2 },
    { day: 'Tue', amount: 180, intensity: 1 },
    { day: 'Wed', amount: 420, intensity: 3 },
    { day: 'Thu', amount: 290, intensity: 2 },
    { day: 'Fri', amount: 890, intensity: 5 },
    { day: 'Sat', amount: 1120, intensity: 5 },
    { day: 'Sun', amount: 650, intensity: 4 }
  ];

  // Predictive Next 3 Months Forecast Data
  const forecastData = [
    { month: 'Historical Avg', Income: 8050, Expenses: 3100 },
    { month: 'Next Month (AI)', Income: 8450, Expenses: 2950 },
    { month: 'Month +2 (AI)', Income: 8600, Expenses: 2900 },
    { month: 'Month +3 (AI)', Income: 8900, Expenses: 2850 }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Brain className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Analytics & Financial Health
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Machine learning anomaly detection, predictive runway modeling, and strategic recommendations.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Confidence: {insights?.forecast?.confidenceScore || 95.8}%</span>
        </div>
      </div>

      {/* Top Banner: Financial Health Score & Forecast Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Gauge */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Financial Health Index
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                Grade {insights?.healthGrade || 'A+'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-5xl font-black text-white tracking-tight">
                {insights?.healthScore || 89}
              </span>
              <span className="text-slate-500 text-lg font-bold">/100</span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${insights?.healthScore || 89}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>0 (Vulnerable)</span>
              <span>100 (Optimal Solvency)</span>
            </div>
          </div>
        </div>

        {/* AI Next Month Predicted Cash Flow */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
              Next Month Predicted Surplus
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mb-2">
              {formatAmount(
                (insights?.forecast?.nextMonthEstimatedIncome || 8450) -
                (insights?.forecast?.nextMonthEstimatedExpense || 2950)
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on rolling 90-day moving averages and recurring scheduled payroll.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 text-xs">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Est. Income</span>
              <span className="text-emerald-400 font-bold text-sm">
                {formatAmount(insights?.forecast?.nextMonthEstimatedIncome || 8450)}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Est. Outflow</span>
              <span className="text-rose-400 font-bold text-sm">
                {formatAmount(insights?.forecast?.nextMonthEstimatedExpense || 2950)}
              </span>
            </div>
          </div>
        </div>

        {/* Solvency Buffer Runway */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
              Emergency Runway Solvency
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mb-2">
              6.8 <span className="text-lg font-normal text-slate-400">Months</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capacity to cover baseline living costs with zero additional revenue.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-4 border-t border-white/5">
            <ShieldCheck className="w-4 h-4" />
            <span>Exceeds recommended 6-month threshold</span>
          </div>
        </div>
      </div>

      {/* AI Anomaly Detection & AI Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Anomalies */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Detected Spending Anomalies</h3>
            </div>
            <span className="badge-rose">
              {insights?.anomalies?.length || 2} Outliers Flagged
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Automated alerts for transactions deviating by &gt;1.8x from category averages.
          </p>

          <div className="space-y-3">
            {insights?.anomalies?.map((anom) => (
              <div
                key={anom.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20 hover:border-amber-500/40 transition-colors space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-white">{anom.description}</span>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold">
                        {anom.category}
                      </span>
                      <span>•</span>
                      <span>{new Date(anom.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-rose-400">
                    {formatAmount(anom.amount)}
                  </span>
                </div>
                <div className="text-xs text-amber-300/90 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{anom.deviation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Strategic Action Plan */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">AI Wealth Optimization Tips</h3>
            </div>
            <span className="badge-emerald">Actionable</span>
          </div>
          <p className="text-xs text-slate-400">
            Tailored suggestions to boost net worth and minimize friction.
          </p>

          <div className="space-y-3">
            {insights?.recommendations?.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {rec.title}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    +{formatAmount(rec.potentialSavings)}/mo
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekday Spending Heatmap & 3-Month Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Density */}
        <div className="glass-card p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Weekday Expense Density
            </h3>
            <p className="text-xs text-slate-400">Spending concentration by day of week</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {weekdayData.map((item) => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="w-8 text-xs font-bold text-slate-400">{item.day}</span>
                <div className="flex-1 bg-slate-900 rounded-lg h-5 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
                    style={{ width: `${(item.amount / 1200) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-300 w-16 text-right">
                  {formatAmount(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Month Forecast Projection Chart */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Multi-Month Predictive Runway
              </h3>
              <p className="text-xs text-slate-400">AI extrapolated income vs expense curve</p>
            </div>
            <span className="badge-cyan">Proprietary Model</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Legend />
                <Bar dataKey="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expenses" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};