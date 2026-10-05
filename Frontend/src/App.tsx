import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { Savings } from './pages/Savings';
import { Recurring } from './pages/Recurring';
import { Settings } from './pages/Settings';
import { QuickAddModal } from './components/QuickAddModal';
import { CommandPalette } from './components/ui/CommandPalette';
import {
  transactionService,
  budgetService,
  savingsService,
  recurringService,
  resetAllDemoData
} from './services/apiService';
import {
  Transaction,
  Budget,
  SavingsGoal,
  RecurringTransaction
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Core Global States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load All Data
  const loadData = async () => {
    setLoading(true);
    const [txList, budgetList, goalList, recList] = await Promise.all([
      transactionService.getAll(),
      budgetService.getAll(),
      savingsService.getAll(),
      recurringService.getAll()
    ]);

    setTransactions(txList);
    setBudgets(budgetList);
    setGoals(goalList);
    setRecurring(recList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Transactions
  const handleAddTransaction = async (data: Omit<Transaction, 'id'>) => {
    const created = await transactionService.create(data);
    setTransactions((prev) => [created, ...prev]);
    // Refresh budgets to compute updated spent totals
    const updatedBudgets = await budgetService.getAll();
    setBudgets(updatedBudgets);
  };

  const handleBulkAddTransactions = async (list: Omit<Transaction, 'id'>[]) => {
    const created = await transactionService.bulkCreate(list);
    setTransactions((prev) => [...created, ...prev]);
    const updatedBudgets = await budgetService.getAll();
    setBudgets(updatedBudgets);
  };

  const handleDeleteTransaction = async (id: string) => {
    await transactionService.delete(id);
    setTransactions((prev) => prev.filter((t) => (t.id || t._id) !== id));
    const updatedBudgets = await budgetService.getAll();
    setBudgets(updatedBudgets);
  };

  // Handlers for Budgets
  const handleSaveBudget = async (budgetData: Partial<Budget>) => {
    await budgetService.createOrUpdate(budgetData);
    const updated = await budgetService.getAll();
    setBudgets(updated);
  };

  const handleDeleteBudget = async (id: string) => {
    await budgetService.delete(id);
    setBudgets((prev) => prev.filter((b) => (b.id || b._id) !== id));
  };

  // Handlers for Goals
  const handleSaveGoal = async (goalData: Omit<SavingsGoal, 'id'>) => {
    const created = await savingsService.create(goalData);
    setGoals((prev) => [...prev, created]);
  };

  const handleContributeGoal = async (id: string, amount: number) => {
    await savingsService.contribute(id, amount);
    const updated = await savingsService.getAll();
    setGoals(updated);
  };

  const handleDeleteGoal = async (id: string) => {
    await savingsService.delete(id);
    setGoals((prev) => prev.filter((g) => (g.id || g._id) !== id));
  };

  // Handlers for Recurring
  const handleSaveRecurring = async (recData: Omit<RecurringTransaction, 'id'>) => {
    const created = await recurringService.create(recData);
    setRecurring((prev) => [...prev, created]);
  };

  const handleToggleRecurring = async (id: string) => {
    await recurringService.toggleActive(id);
    const updated = await recurringService.getAll();
    setRecurring(updated);
  };

  const handleDeleteRecurring = async (id: string) => {
    await recurringService.delete(id);
    setRecurring((prev) => prev.filter((r) => (r.id || r._id) !== id));
  };

  // Reset demo
  const handleResetData = () => {
    resetAllDemoData();
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              transactions={transactions}
              budgets={budgets}
              goals={goals}
              recurring={recurring}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              onNavigate={setActiveTab}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics
              transactions={transactions}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {activeTab === 'transactions' && (
            <Transactions
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onBulkAddTransactions={handleBulkAddTransactions}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {activeTab === 'budgets' && (
            <Budgets
              budgets={budgets}
              onSaveBudget={handleSaveBudget}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {activeTab === 'savings' && (
            <Savings
              goals={goals}
              onSaveGoal={handleSaveGoal}
              onContributeGoal={handleContributeGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeTab === 'recurring' && (
            <Recurring
              recurring={recurring}
              onSaveRecurring={handleSaveRecurring}
              onToggleActive={handleToggleRecurring}
              onDeleteRecurring={handleDeleteRecurring}
            />
          )}

          {activeTab === 'settings' && (
            <Settings onResetData={handleResetData} />
          )}
        </main>
      </div>

      {/* Modals & Command Palette */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAdd={handleAddTransaction}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onResetData={handleResetData}
      />
    </div>
  );
}
