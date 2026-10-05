export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  _id?: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
  date: string;
  tags?: string[];
  notes?: string;
}

export interface Budget {
  id: string;
  _id?: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: 'monthly' | 'weekly' | 'yearly';
  warningThresholdPercent: number;
  isExceeded?: boolean;
}

export interface SavingsGoal {
  id: string;
  _id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  color: string;
  icon: string;
  isCompleted?: boolean;
}

export interface RecurringTransaction {
  id: string;
  _id?: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  nextOccurrence: string;
  tags?: string[];
  notes?: string;
  isActive: boolean;
}

export interface AIAnomaly {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  deviation: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  potentialSavings: number;
}

export interface AIInsightsData {
  healthScore: number;
  healthGrade: string;
  anomalies: AIAnomaly[];
  goalProjections: Array<{
    goalId: string;
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    estimatedCompletionDate: string;
    monthsRemaining: string | number;
    status: string;
  }>;
  recommendations: AIRecommendation[];
  forecast: {
    nextMonthEstimatedIncome: number;
    nextMonthEstimatedExpense: number;
    confidenceScore: number;
  };
}

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  categoryBreakdown: Array<{ _id: string; total: number; count: number }>;
  monthlyTrends: Array<{
    _id: { year: number; month: number; type: TransactionType };
    total: number;
  }>;
  weekdayDensity: Array<{ _id: number; total: number; count: number }>;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateVsUSD: number; // For dynamic conversion preview
}
