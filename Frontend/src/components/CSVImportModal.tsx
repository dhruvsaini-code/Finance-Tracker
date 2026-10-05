import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (transactions: Omit<Transaction, 'id'>[]) => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Omit<Transaction, 'id'>[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          setError('CSV file must have a header row and at least 1 data row.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const descIdx = headers.findIndex((h) => h.includes('desc') || h.includes('name') || h.includes('payee'));
        const amtIdx = headers.findIndex((h) => h.includes('amount') || h.includes('cost') || h.includes('price'));
        const catIdx = headers.findIndex((h) => h.includes('cat') || h.includes('type'));
        const typeIdx = headers.findIndex((h) => h === 'type' || h.includes('in/out') || h.includes('kind'));
        const dateIdx = headers.findIndex((h) => h.includes('date') || h.includes('time'));

        const parsed: Omit<Transaction, 'id'>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 2) continue;

          const desc = descIdx >= 0 ? cols[descIdx] : cols[0] || 'Imported Transaction';
          const rawAmt = amtIdx >= 0 ? cols[amtIdx] : cols[1];
          const amt = Math.abs(parseFloat(rawAmt.replace(/[^0-9.-]+/g, ''))) || 10;
          const cat = catIdx >= 0 && cols[catIdx] ? cols[catIdx] : 'Other';
          const explicitType = typeIdx >= 0 ? cols[typeIdx].toLowerCase() : '';
          const isIncome = explicitType.includes('in') || rawAmt.startsWith('+');
          const dateStr = dateIdx >= 0 && cols[dateIdx] ? cols[dateIdx] : new Date().toISOString();

          parsed.push({
            description: desc,
            amount: amt,
            category: cat,
            type: (isIncome ? 'income' : 'expense') as TransactionType,
            date: new Date(dateStr).toISOString() || new Date().toISOString(),
            tags: ['csv-import'],
            notes: 'Imported via CSV spreadsheet'
          });
        }

        if (parsed.length === 0) {
          setError('Could not extract valid records. Format: Description, Amount, Category, Type, Date');
        } else {
          setParsedData(parsed);
        }
      } catch (err: any) {
        setError('Error parsing CSV file: ' + err.message);
      }
    };
    reader.readAsText(selected);
  };

  const handleConfirm = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl glass-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-lg">CSV Bulk Importer</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* File Upload Drop Area */}
          <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/50 rounded-2xl p-8 text-center bg-slate-950/40 transition-colors">
            <FileText className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-white mb-1">
              Select or Drop CSV Spreadsheet
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Columns: Description, Amount, Category, Type, Date
            </p>
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all inline-block shadow-sm">
              Browse CSV File
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {file && <span className="block text-xs text-emerald-400 mt-2 font-medium">Selected: {file.name}</span>}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span>Previewing {parsedData.length} records ready to import:</span>
                <span className="badge-emerald">{parsedData.length} Ready</span>
              </div>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-white/5 bg-slate-950/60 divide-y divide-white/5 text-xs">
                {parsedData.slice(0, 10).map((row, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <span className="text-white font-medium">{row.description}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{row.category}</span>
                      <span className={row.type === 'income' ? 'text-emerald-400 font-bold' : 'text-slate-100 font-bold'}>
                        {row.type === 'income' ? '+' : '-'}${row.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={parsedData.length === 0}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-glow-cyan transition-all"
            >
              Import {parsedData.length} Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
