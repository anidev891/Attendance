import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Plus, Receipt, X, Upload, IndianRupee } from 'lucide-react';
import type { ExpenseRequest } from '../../types';
import SearchableSelect from '../shared/SearchableSelect';

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
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
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
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Expenses</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 shadow-sm hover:bg-emerald-600 transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-6" onClick={e => e.stopPropagation()} style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Add Expense</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expense Type</label>
                <SearchableSelect
                  options={expenseTypeOptions}
                  value={expenseTypeOptions.find(o => o.value === type) || null}
                  onChange={opt => setType((opt?.value || 'travel') as ExpenseRequest['type'])}
                  placeholder="Select expense type..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.amount ? 'border-red-300' : 'border-slate-200'}`}
                  />
                </div>
                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe the expense"
                  className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none ${errors.description ? 'border-red-300' : 'border-slate-200'}`}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Bill</label>
                <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">{billFile || 'Choose a file'}</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
              >
                Submit Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {myExpenses.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
          <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No expenses submitted yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myExpenses.map(exp => {
            const statusLineColor = exp.status === 'approved' ? 'border-l-emerald-500' : 
                                  exp.status === 'rejected' ? 'border-l-rose-500' : 
                                  'border-l-amber-500';
            return (
              <div key={exp.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 border-l-4 ${statusLineColor}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                      {typeIcon(exp.type)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{exp.description}</p>
                      <p className="text-xs text-slate-400 mt-1 capitalize font-medium">{exp.type} • {formatDate(exp.appliedOn)} {exp.billFile ? '• Bill Attached' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-800">₹{exp.amount.toLocaleString()}</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border inline-block mt-1 uppercase tracking-wider ${statusColor(exp.status)}`}>
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

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
}
