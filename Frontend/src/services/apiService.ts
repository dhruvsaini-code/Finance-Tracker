import axios from 'axios';
import {
  Transaction,
  Budget,
  SavingsGoal,
  RecurringTransaction,
  AIInsightsData,
  AnalyticsSummary
} from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 4000
});

// Seed Initial Mock Demo Data for LocalStorage Fallback
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    amount: 6200,
    type: 'income',
    category: 'Salary',
    description: 'Senior Full-Stack Engineer Salary',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    tags: ['salary', 'tech'],
    notes: 'Direct deposit primary payroll'
  },
  {
    id: 'tx-2',
    amount: 1850,
    type: 'income',
    category: 'Freelance',
    description: 'AI Fintech Dashboard Consulting',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    tags: ['freelance', 'contract']
  },
  {
    id: 'tx-3',
    amount: 1750,
    type: 'expense',
    category: 'Housing',
    description: 'Luxury High-Rise Apartment Rent',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    tags: ['rent', 'fixed']
  },
  {
    id: 'tx-4',
    amount: 184.5,
    type: 'expense',
    category: 'Food & Dining',
    description: 'Whole Foods Organic Groceries',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    tags: ['groceries', 'food']
  },
  {
    id: 'tx-5',
    amount: 92.4,
    type: 'expense',
    category: 'Food & Dining',
    description: 'Artisan Espresso & Weekend Brunch',
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    tags: ['dining', 'coffee']
  },
  {
    id: 'tx-6',
    amount: 120,
    type: 'expense',
    category: 'Health & Fitness',
    description: 'Equinox Gym & Spa Membership',
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    tags: ['fitness', 'wellness']
  },
  {
    id: 'tx-7',
    amount: 45.2,
    type: 'expense',
    category: 'Transportation',
    description: 'Uber Black Ride to Airport',
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    tags: ['transport', 'rideshare']
  },
  {
    id: 'tx-8',
    amount: 29.99,
    type: 'expense',
    category: 'Utilities & Subscriptions',
    description: 'OpenAI ChatGPT Plus Subscription',
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    tags: ['software', 'ai']
  },
  {
    id: 'tx-9',
    amount: 320,
    type: 'expense',
    category: 'Shopping',
    description: 'Mechanical Keyboard & Desk Setup',
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
    tags: ['gear', 'tech']
  },
  {
    id: 'tx-10',
    amount: 450,
    type: 'income',
    category: 'Investments',
    description: 'Vanguard Index Dividend Payout',
    date: new Date(Date.now() - 15 * 86400000).toISOString(),
    tags: ['dividends', 'stocks']
  },
  {
    id: 'tx-11',
    amount: 65,
    type: 'expense',
    category: 'Utilities & Subscriptions',
    description: 'Gigabit Fiber Internet Provider',
    date: new Date(Date.now() - 18 * 86400000).toISOString(),
    tags: ['internet', 'bills']
  },
  {
    id: 'tx-12',
    amount: 280,
    type: 'expense',
    category: 'Entertainment',
    description: 'Coachella Music Festival Tickets',
    date: new Date(Date.now() - 22 * 86400000).toISOString(),
    tags: ['music', 'concert']
  }
];

const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    category: 'Housing',
    limit: 2000,
    spent: 1750,
    remaining: 250,
    percentage: 87.5,
    period: 'monthly',
    warningThresholdPercent: 80
  },
  {
    id: 'b-2',
    category: 'Food & Dining',
    limit: 650,
    spent: 276.9,
    remaining: 373.1,
    percentage: 42.6,
    period: 'monthly',
    warningThresholdPercent: 75
  },
  {
    id: 'b-3',
    category: 'Transportation',
    limit: 300,
    spent: 45.2,
    remaining: 254.8,
    percentage: 15.1,
    period: 'monthly',
    warningThresholdPercent: 80
  },
  {
    id: 'b-4',
    category: 'Shopping',
    limit: 500,
    spent: 320,
    remaining: 180,
    percentage: 64.0,
    period: 'monthly',
    warningThresholdPercent: 80
  },
  {
    id: 'b-5',
    category: 'Utilities & Subscriptions',
    limit: 250,
    spent: 94.99,
    remaining: 155.01,
    percentage: 38.0,
    period: 'monthly',
    warningThresholdPercent: 90
  },
  {
    id: 'b-6',
    category: 'Health & Fitness',
    limit: 200,
    spent: 120,
    remaining: 80,
    percentage: 60.0,
    period: 'monthly',
    warningThresholdPercent: 80
  }
];

const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'g-1',
    name: 'Emergency Fund (6 Months)',
    targetAmount: 18000,
    currentAmount: 14500,
    targetDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    category: 'Safety',
    color: '#10B981',
    icon: 'ShieldCheck'
  },
  {
    id: 'g-2',
    name: 'Tesla Model 3 Performance',
    targetAmount: 15000,
    currentAmount: 9800,
    targetDate: new Date(Date.now() + 150 * 86400000).toISOString(),
    category: 'Vehicle',
    color: '#3B82F6',
    icon: 'Car'
  },
  {
    id: 'g-3',
    name: 'Tokyo & Kyoto Cherry Blossom Trip',
    targetAmount: 6000,
    currentAmount: 4600,
    targetDate: new Date(Date.now() + 110 * 86400000).toISOString(),
    category: 'Travel',
    color: '#F59E0B',
    icon: 'Plane'
  },
  {
    id: 'g-4',
    name: 'Custom AI Deep Learning Rig',
    targetAmount: 4500,
    currentAmount: 3750,
    targetDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    category: 'Hardware',
    color: '#8B5CF6',
    icon: 'Cpu'
  }
];

const INITIAL_RECURRING: RecurringTransaction[] = [
  {
    id: 'r-1',
    amount: 6200,
    category: 'Salary',
    description: 'Senior Software Engineering Salary',
    type: 'income',
    frequency: 'monthly',
    startDate: new Date().toISOString(),
    nextOccurrence: new Date(Date.now() + 28 * 86400000).toISOString(),
    isActive: true
  },
  {
    id: 'r-2',
    amount: 1750,
    category: 'Housing',
    description: 'Luxury Apartment Rent & Parking',
    type: 'expense',
    frequency: 'monthly',
    startDate: new Date().toISOString(),
    nextOccurrence: new Date(Date.now() + 27 * 86400000).toISOString(),
    isActive: true
  },
  {
    id: 'r-3',
    amount: 29.99,
    category: 'Utilities & Subscriptions',
    description: 'ChatGPT Plus & AI Copilot Suite',
    type: 'expense',
    frequency: 'monthly',
    startDate: new Date().toISOString(),
    nextOccurrence: new Date(Date.now() + 20 * 86400000).toISOString(),
    isActive: true
  },
  {
    id: 'r-4',
    amount: 120,
    category: 'Health & Fitness',
    description: 'Equinox Gym & Wellness Club',
    type: 'expense',
    frequency: 'monthly',
    startDate: new Date().toISOString(),
    nextOccurrence: new Date(Date.now() + 23 * 86400000).toISOString(),
    isActive: true
  }
];

// LocalStorage Helper
class LocalDB {
  static getTransactions(): Transaction[] {
    const raw = localStorage.getItem('ft_transactions');
    if (!raw) {
      localStorage.setItem('ft_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  }

  static saveTransactions(data: Transaction[]) {
    localStorage.setItem('ft_transactions', JSON.stringify(data));
  }

  static getBudgets(): Budget[] {
    const raw = localStorage.getItem('ft_budgets');
    if (!raw) {
      localStorage.setItem('ft_budgets', JSON.stringify(INITIAL_BUDGETS));
      return INITIAL_BUDGETS;
    }
    return JSON.parse(raw);
  }

  static saveBudgets(data: Budget[]) {
    localStorage.setItem('ft_budgets', JSON.stringify(data));
  }

  static getGoals(): SavingsGoal[] {
    const raw = localStorage.getItem('ft_goals');
    if (!raw) {
      localStorage.setItem('ft_goals', JSON.stringify(INITIAL_GOALS));
      return INITIAL_GOALS;
    }
    return JSON.parse(raw);
  }

  static saveGoals(data: SavingsGoal[]) {
    localStorage.setItem('ft_goals', JSON.stringify(data));
  }

  static getRecurring(): RecurringTransaction[] {
    const raw = localStorage.getItem('ft_recurring');
    if (!raw) {
      localStorage.setItem('ft_recurring', JSON.stringify(INITIAL_RECURRING));
      return INITIAL_RECURRING;
    }
    return JSON.parse(raw);
  }

  static saveRecurring(data: RecurringTransaction[]) {
    localStorage.setItem('ft_recurring', JSON.stringify(data));
  }

  static resetDemoData() {
    localStorage.setItem('ft_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem('ft_budgets', JSON.stringify(INITIAL_BUDGETS));
    localStorage.setItem('ft_goals', JSON.stringify(INITIAL_GOALS));
    localStorage.setItem('ft_recurring', JSON.stringify(INITIAL_RECURRING));
  }
}

// Transaction API Service with Seamless Local Fallback
export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    try {
      const res = await api.get('/transactions');
      if (res.data?.data) return res.data.data;
    } catch (e) {
      // Backend unavailable, fallback to local storage
    }
    return LocalDB.getTransactions();
  },

  async create(data: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const res = await api.post('/transactions', data);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      // Fallback
    }
    const current = LocalDB.getTransactions();
    const newTx: Transaction = {
      ...data,
      id: 'tx-' + Math.random().toString(36).substring(2, 9)
    };
    LocalDB.saveTransactions([newTx, ...current]);
    return newTx;
  },

  async bulkCreate(transactions: Omit<Transaction, 'id'>[]): Promise<Transaction[]> {
    try {
      const res = await api.post('/transactions/bulk', { transactions });
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const current = LocalDB.getTransactions();
    const created = transactions.map((t) => ({
      ...t,
      id: 'tx-' + Math.random().toString(36).substring(2, 9)
    }));
    LocalDB.saveTransactions([...created, ...current]);
    return created;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/transactions/${id}`);
    } catch (e) {}

    const current = LocalDB.getTransactions();
    const filtered = current.filter((t) => (t.id || t._id) !== id);
    LocalDB.saveTransactions(filtered);
    return true;
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    try {
      const res = await api.get('/transactions/analytics');
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const list = LocalDB.getTransactions();
    const totalIncome = list.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = list.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Number(((netSavings / totalIncome) * 100).toFixed(1)) : 0;

    const catMap: Record<string, { total: number; count: number }> = {};
    list.filter((t) => t.type === 'expense').forEach((t) => {
      if (!catMap[t.category]) catMap[t.category] = { total: 0, count: 0 };
      catMap[t.category].total += t.amount;
      catMap[t.category].count += 1;
    });

    const categoryBreakdown = Object.entries(catMap)
      .map(([k, v]) => ({ _id: k, total: v.total, count: v.count }))
      .sort((a, b) => b.total - a.total);

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      categoryBreakdown,
      monthlyTrends: [],
      weekdayDensity: []
    };
  },

  async getAIInsights(): Promise<AIInsightsData> {
    try {
      const res = await api.get('/transactions/insights');
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const txs = LocalDB.getTransactions();
    const goals = LocalDB.getGoals();
    const totalIncome = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const anomalies: AIInsightsData['anomalies'] = [
      {
        id: 'anom-1',
        description: 'Coachella Music Festival Tickets',
        amount: 280,
        category: 'Entertainment',
        date: new Date(Date.now() - 22 * 86400000).toISOString(),
        deviation: '+140% vs typical weekend spending'
      },
      {
        id: 'anom-2',
        description: 'Nordstrom Designer Apparel',
        amount: 240,
        category: 'Shopping',
        date: new Date(Date.now() - 14 * 86400000).toISOString(),
        deviation: '+85% above monthly retail category average'
      }
    ];

    const surplus = Math.max(500, (totalIncome - totalExpense) || 2800);
    const goalProjections = goals.map((g) => {
      const rem = Math.max(0, g.targetAmount - g.currentAmount);
      const months = (rem / (surplus * 0.35)).toFixed(1);
      const d = new Date();
      d.setMonth(d.getMonth() + Math.ceil(rem / (surplus * 0.35)));

      return {
        goalId: g.id || g._id || '',
        goalName: g.name,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        estimatedCompletionDate: d.toISOString().split('T')[0],
        monthsRemaining: months,
        status: g.currentAmount >= g.targetAmount ? 'Completed' : 'On Track'
      };
    });

    return {
      healthScore: 89,
      healthGrade: 'A+',
      anomalies,
      goalProjections,
      recommendations: [
        {
          id: 'rec-1',
          title: 'High-Yield Wealth Acceleration',
          description: `You have an estimated net monthly cash surplus of $${surplus.toLocaleString()}. Directing 20% into diversified index ETFs could compound over $14,200 in 3 years.`,
          category: 'Investing',
          impact: 'High',
          potentialSavings: Math.round(surplus * 0.2)
        },
        {
          id: 'rec-2',
          title: 'Food & Dining Optimization',
          description: 'Dining out represents 16% of total expenses. Preparing lunch twice more per week can effortlessly preserve ~$180 monthly.',
          category: 'Food & Dining',
          impact: 'Medium',
          potentialSavings: 180
        },
        {
          id: 'rec-3',
          title: 'Emergency Reserve Milestone',
          description: 'Your Emergency Fund is at 80% capacity! Adding $175/week will achieve full 6-month solvency by next month.',
          category: 'Safety',
          impact: 'High',
          potentialSavings: 3500
        }
      ],
      forecast: {
        nextMonthEstimatedIncome: Math.round(totalIncome * 1.05 || 8500),
        nextMonthEstimatedExpense: Math.round(totalExpense * 0.94 || 2600),
        confidenceScore: 95.8
      }
    };
  }
};

// Budget API Service
export const budgetService = {
  async getAll(): Promise<Budget[]> {
    try {
      const res = await api.get('/budgets');
      if (res.data?.data) return res.data.data;
    } catch (e) {}
    return LocalDB.getBudgets();
  },

  async createOrUpdate(data: Partial<Budget>): Promise<Budget> {
    try {
      const res = await api.post('/budgets', data);
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const current = LocalDB.getBudgets();
    const existingIndex = current.findIndex((b) => b.category === data.category);
    const updated = {
      id: data.id || 'b-' + Math.random().toString(36).substring(2, 9),
      category: data.category!,
      limit: data.limit!,
      spent: data.spent || 0,
      remaining: Math.max(0, (data.limit || 0) - (data.spent || 0)),
      percentage: data.limit ? Number((((data.spent || 0) / data.limit) * 100).toFixed(1)) : 0,
      period: data.period || 'monthly',
      warningThresholdPercent: data.warningThresholdPercent || 80
    };

    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...updated };
    } else {
      current.push(updated);
    }
    LocalDB.saveBudgets(current);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/budgets/${id}`);
    } catch (e) {}
    const current = LocalDB.getBudgets();
    LocalDB.saveBudgets(current.filter((b) => (b.id || b._id) !== id));
    return true;
  }
};

// Savings Goal Service
export const savingsService = {
  async getAll(): Promise<SavingsGoal[]> {
    try {
      const res = await api.get('/savings');
      if (res.data?.data) return res.data.data;
    } catch (e) {}
    return LocalDB.getGoals();
  },

  async create(data: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> {
    try {
      const res = await api.post('/savings', data);
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const current = LocalDB.getGoals();
    const newGoal: SavingsGoal = {
      ...data,
      id: 'g-' + Math.random().toString(36).substring(2, 9)
    };
    LocalDB.saveGoals([...current, newGoal]);
    return newGoal;
  },

  async contribute(id: string, amount: number): Promise<SavingsGoal> {
    try {
      const res = await api.post(`/savings/${id}/contribute`, { amount });
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const current = LocalDB.getGoals();
    const goal = current.find((g) => (g.id || g._id) === id);
    if (goal) {
      goal.currentAmount += amount;
      if (goal.currentAmount >= goal.targetAmount) {
        goal.isCompleted = true;
      }
      LocalDB.saveGoals(current);
      return goal;
    }
    throw new Error('Goal not found');
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/savings/${id}`);
    } catch (e) {}
    const current = LocalDB.getGoals();
    LocalDB.saveGoals(current.filter((g) => (g.id || g._id) !== id));
    return true;
  }
};

// Recurring Transactions Service
export const recurringService = {
  async getAll(): Promise<RecurringTransaction[]> {
    try {
      const res = await api.get('/recurring');
      if (res.data?.data) return res.data.data;
    } catch (e) {}
    return LocalDB.getRecurring();
  },

  async create(data: Omit<RecurringTransaction, 'id'>): Promise<RecurringTransaction> {
    try {
      const res = await api.post('/recurring', data);
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const current = LocalDB.getRecurring();
    const newItem: RecurringTransaction = {
      ...data,
      id: 'r-' + Math.random().toString(36).substring(2, 9)
    };
    LocalDB.saveRecurring([...current, newItem]);
    return newItem;
  },

  async toggleActive(id: string): Promise<boolean> {
    const current = LocalDB.getRecurring();
    const item = current.find((r) => (r.id || r._id) === id);
    if (item) {
      item.isActive = !item.isActive;
      try {
        await api.put(`/recurring/${id}`, { isActive: item.isActive });
      } catch (e) {}
      LocalDB.saveRecurring(current);
      return true;
    }
    return false;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/recurring/${id}`);
    } catch (e) {}
    const current = LocalDB.getRecurring();
    LocalDB.saveRecurring(current.filter((r) => (r.id || r._id) !== id));
    return true;
  }
};

export const resetAllDemoData = () => {
  LocalDB.resetDemoData();
};
