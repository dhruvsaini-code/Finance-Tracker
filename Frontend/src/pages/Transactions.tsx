import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Calendar,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { useCurrencyStore } from '../store/currencyStore';
import { CSVImportModal } from '../components/CSVImportModal';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onBulkAddTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenQuickAdd: () => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  onAddTransaction,
  onBulkAddTransactions,
  onDeleteTransaction,
  onOpenQuickAdd
}) => {
  const { formatAmount } = useCurrencyStore();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  // Filter transactions
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())));

    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(transactions.map((t) => t.category)));

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Description', 'Amount', 'Category', 'Type', 'Date', 'Tags', 'Notes'];
    const rows = filtered.map((t) => [
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.category}"`,
      t.type,
      new Date(t.date).toISOString().split('T')[0],
      `"${(t.tags || []).join(';')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial-statement-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF Statement
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Receipt className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Transactions & Audit Ledger
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Complete searchable ledger, CSV data ingestion, and printable export engine.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsCSVModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold transition-colors"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-glow-emerald transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by payee, category, memo or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 glass-input text-xs"
          />
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full glass-input text-xs"
          >
            <option value="all" className="bg-slate-900">All Flow Types (In & Out)</option>
            <option value="income" className="bg-slate-900">Income Inflows Only</option>
            <option value="expense" className="bg-slate-900">Expense Outflows Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full glass-input text-xs"
          >
            <option value="all" className="bg-slate-900">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c} className="bg-slate-900">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} entries matching criteria</span>
          <span className="font-semibold text-slate-300">Sorted by newest</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-white/5 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Payee / Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx.id || tx._id}
                    className="hover:bg-slate-900/50 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl border ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">
                            {tx.description}
                          </span>
                          {tx.notes && (
                            <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                              {tx.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-white/5">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(tx.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-extrabold text-sm ${
                          isIncome ? 'text-emerald-400' : 'text-slate-100'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatAmount(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteTransaction(tx.id || tx._id || '')}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImport={onBulkAddTransactions}
      />
    </div>
  );
};
