import { useAppData } from '../../context/AppDataContext';
import { Check, X, Receipt, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

import { formatDate } from '../../utils/dateUtils';

export default function AdminExpenseApprovals() {
  const { expenses, updateExpenseStatus } = useAppData();
  const { showSuccess, showError, confirm } = useNotification();
  const pending = expenses.filter(e => e.status === 'pending');
  const history = expenses.filter(e => e.status !== 'pending');

  const handleApprove = (id: string) => {
    confirm({
      title: 'Approve Expense?',
      message: 'Are you sure you want to approve this expense request?',
      type: 'success',
      onConfirm: () => {
        updateExpenseStatus(id, 'approved');
        showSuccess('Expense request approved successfully');
      }
    });
  };

  const handleReject = (id: string) => {
    confirm({
      title: 'Reject Expense?',
      message: 'Are you sure you want to reject this expense request?',
      type: 'danger',
      onConfirm: () => {
        updateExpenseStatus(id, 'rejected');
        showError('Expense request has been rejected');
      }
    });
  };

  return (
    <div className="space-y-12 animate-slide-up">
      <div>
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6 ml-4">Pending Authorization ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="glass-card rounded-[3rem] p-20 text-center border-[var(--card-border)] shadow-2xl">
            <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-[var(--card-border)]">
              <Receipt className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.3em] text-xs">Zero pending expense requests</p>
          </div>
        ) : (
          <div className="space-y-5">
            {pending.map(exp => (
              <div key={exp.id} className="glass-card rounded-[2.5rem] p-8 border border-[var(--card-border)] border-l-[12px] border-l-brand-red hover:translate-x-2 transition-all duration-500 shadow-xl group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                       <p className="text-xl font-black text-[var(--text-main)] tracking-tight uppercase group-hover:text-brand-red transition-colors">{exp.employeeName}</p>
                       <span className="text-[9px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">{exp.type} Expense</span>
                    </div>
                    <p className="text-sm font-black text-[var(--text-muted)] uppercase tracking-tight leading-relaxed mb-4">{exp.description}</p>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-brand-red" />
                          <span className="text-xl font-black text-[var(--text-main)] tabular-nums tracking-tighter">₹{exp.amount.toLocaleString()}</span>
                       </div>
                       <span className="text-[10px] font-black text-brand-red/60 uppercase tracking-widest tabular-nums">Applied: {formatDate(exp.appliedOn)}</span>
                       {exp.billFile && (
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                             <CheckCircle2 className="w-3.5 h-3.5" />
                             Artifact Attached
                          </span>
                       )}
                    </div>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    <button
                      onClick={() => handleApprove(exp.id)}
                      className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 ring-1 ring-white/20"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(exp.id)}
                      className="flex items-center gap-3 px-8 py-4 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] hover:bg-brand-red hover:text-white hover:border-brand-red text-brand-red rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div>
          <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6 ml-4">Fiscal Authorization History</h3>
          <div className="glass-card rounded-[3.5rem] shadow-2xl border border-[var(--card-border)] border-l-[12px] border-l-brand-red overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)]">
                    <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Personnel</th>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden sm:table-cell">Protocol</th>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Valuation</th>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Temporal Mark</th>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Auth Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {history.map(exp => (
                    <tr key={exp.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-6 text-sm font-black text-[var(--text-main)] uppercase tracking-tight group-hover:text-brand-red transition-colors">{exp.employeeName}</td>
                      <td className="px-10 py-6 text-sm font-black text-brand-red/60 uppercase tracking-widest hidden sm:table-cell">{exp.type}</td>
                      <td className="px-10 py-6 text-sm font-black text-[var(--text-main)] tabular-nums tracking-tighter">₹{exp.amount.toLocaleString()}</td>
                      <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] tabular-nums">{formatDate(exp.appliedOn)}</td>
                      <td className="px-10 py-6">
                        <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${
                          exp.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
