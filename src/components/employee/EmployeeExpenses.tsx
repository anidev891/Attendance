import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Plus, Receipt, X, Upload, IndianRupee } from 'lucide-react';
import type { ExpenseRequest } from '../../types';
import SearchableSelect from '../shared/SearchableSelect';

import { formatDate } from '../../utils/dateUtils';

export default function EmployeeExpenses() {
  const { employee } = useAuth();
  const { expenses, addExpense } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<ExpenseRequest['type']>('travel');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [billFile, setBillFile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const myExpenses = expenses.filter(e => e.employeeId === employee?.id);

  const expenseTypeOptions = useMemo(() => [
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food' },
    { value: 'other', label: 'Other' },
  ], []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Valid amount is required';
    if (!description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const today = new Date().toISOString().split('T')[0];
    addExpense({
      id: `ex-${Date.now()}`,
      employeeId: employee!.id,
      employeeName: employee!.name,
      type,
      amount: Number(amount),
      description,
      billFile,
      status: 'pending',
      appliedOn: today,
    });
    setShowForm(false);
    setType('travel');
    setAmount('');
    setDescription('');
    setBillFile(null);
    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBillFile(file.name);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  const typeIcon = (t: string) => {
    switch (t) {
      case 'travel': return 'T';
      case 'food': return 'F';
      default: return 'O';
    }
  };

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-base font-black text-[var(--text-main)] uppercase tracking-tight">Expense Ledger</h2>
           <p className="text-[var(--text-muted)] text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">Claim Portal</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="premium-gradient text-white px-6 py-2.5 rounded-xl text-[8px] font-black flex items-center gap-2 shadow-lg shadow-brand-red/10 active:scale-95 uppercase tracking-widest ring-1 ring-white/10"
        >
          <Plus className="w-4 h-4" /> Initialize
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 dark:bg-brand-dark/90 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-8 border border-[var(--card-border)] shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-xl text-[var(--text-main)] tracking-tighter uppercase">Initialize Claim</h3>
                <p className="text-[8px] font-black text-brand-red uppercase tracking-[0.2em] mt-1">Formal Reimbursement Request</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-brand-red group rounded-xl transition-all border border-[var(--card-border)] shadow-sm">
                <X className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Expenditure Category</label>
                <SearchableSelect
                  options={expenseTypeOptions}
                  value={expenseTypeOptions.find(o => o.value === type) || null}
                  onChange={opt => setType((opt?.value || 'travel') as ExpenseRequest['type'])}
                  placeholder="Select Category..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Monetary Value (INR)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red" />
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`glass-input w-full pl-12 pr-4 py-3 rounded-xl text-xs font-black tabular-nums ${errors.amount ? 'border-brand-red/50 focus:ring-brand-red/20' : ''}`}
                  />
                </div>
                {errors.amount && <p className="text-[8px] font-black text-brand-red uppercase tracking-widest ml-2">{errors.amount}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Provide context..."
                  className={`glass-input w-full px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight resize-none ${errors.description ? 'border-brand-red/50 focus:ring-brand-red/20' : ''}`}
                />
                {errors.description && <p className="text-[8px] font-black text-brand-red uppercase tracking-widest ml-2">{errors.description}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Verification Artifact</label>
                <label className="flex items-center gap-3 px-4 py-3 bg-black/5 dark:bg-white/5 border border-dashed border-[var(--card-border)] rounded-xl cursor-pointer hover:border-brand-red/50 hover:bg-brand-red/5 transition-all group shadow-sm">
                  <Upload className="w-4 h-4 text-brand-red group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest group-hover:text-brand-red transition-colors truncate">{billFile || 'Attach Receipt'}</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 premium-gradient text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-brand-red/10 active:scale-[0.98] ring-1 ring-white/10"
                >
                  Transmit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {myExpenses.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-12 text-center border-[var(--card-border)] shadow-lg">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-[var(--card-border)]">
             <Receipt className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px]">Zero historical records</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myExpenses.map(exp => {
            const statusLineColor = exp.status === 'approved' ? 'border-l-emerald-500' : 
                                   exp.status === 'rejected' ? 'border-l-rose-500' : 
                                   'border-l-amber-500';
            return (
              <div key={exp.id} className={`glass-card rounded-[1.5rem] p-5 border border-[var(--card-border)] border-l-[8px] ${statusLineColor} hover:translate-x-1 transition-all duration-300 shadow-md group overflow-hidden`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-[var(--text-muted)] ring-1 ring-[var(--card-border)] group-hover:ring-brand-red/30 transition-all shadow-sm">
                      {typeIcon(exp.type)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--text-main)] group-hover:text-brand-red transition-colors uppercase tracking-tight">{exp.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                         <span className="text-[8px] font-black text-brand-red/60 uppercase tracking-widest">{exp.type}</span>
                         <span className="w-1 h-1 bg-[var(--card-border)] rounded-full" />
                         <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">{formatDate(exp.appliedOn)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[var(--text-main)] tracking-tighter tabular-nums">₹{exp.amount.toLocaleString()}</p>
                    <span className={`text-[8px] font-black px-3 py-1 rounded-lg border inline-block mt-1.5 uppercase tracking-widest shadow-sm ${statusColor(exp.status)}`}>
                      {exp.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
