import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Plus, Laptop, X, Calendar, Send } from 'lucide-react';
import DatePicker from '../shared/DatePicker';

import { formatDate } from '../../utils/dateUtils';

export default function EmployeeWfh() {
  const { employee } = useAuth();
  const { wfhRequests, addWfhRequest } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const myRequests = wfhRequests.filter(r => r.employeeId === employee?.id);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Date is required';
    if (!reason.trim()) e.reason = 'Reason is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const today = new Date().toISOString().split('T')[0];
    const dateStr = date!.toISOString().split('T')[0];

    addWfhRequest({
      id: `wf-${Date.now()}`,
      employeeId: employee!.id,
      employeeName: employee!.name,
      date: dateStr,
      reason,
      status: 'pending',
      appliedOn: today,
    });
    setShowForm(false);
    setDate(null);
    setReason('');
    setErrors({});
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-base font-black text-[var(--text-main)] uppercase tracking-tight">Remote Ops</h2>
           <p className="text-[var(--text-muted)] text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">Geofence Bypass</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="premium-gradient text-white px-6 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-brand-red/10 hover:shadow-brand-red/20 transition-all active:scale-95 ring-1 ring-white/10"
        >
          <Plus className="w-3.5 h-3.5" /> Initialize
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 dark:bg-brand-dark/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-[var(--card-border)]" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-[var(--card-border)] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
              <div>
                <h3 className="font-black text-xl text-[var(--text-main)] tracking-tighter uppercase">Remote Protocol</h3>
                <p className="text-[8px] font-black text-brand-red uppercase tracking-[0.2em] mt-1">Out-of-Office Auth</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-brand-red group rounded-xl transition-all border border-[var(--card-border)]">
                <X className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Date</label>
                <DatePicker selected={date} onChange={setDate} placeholderText="Select date" className={errors.date ? 'border-brand-red/50' : ''} />
                {errors.date && <p className="text-[8px] font-black text-brand-red uppercase tracking-widest ml-2">{errors.date}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Reason</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                  placeholder="Justify remote status..."
                  className={`glass-input w-full px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight resize-none placeholder:text-[var(--text-muted)] ${errors.reason ? 'border-brand-red/50' : ''}`}
                />
                {errors.reason && <p className="text-[8px] font-black text-brand-red uppercase tracking-widest ml-2">{errors.reason}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-4 premium-gradient text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-brand-red/10 active:scale-[0.98] ring-1 ring-white/10 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Transmit
              </button>
            </form>
          </div>
        </div>
      )}

      {myRequests.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-12 text-center border-[var(--card-border)] shadow-lg">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-[var(--card-border)]">
             <Laptop className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px]">Zero historical records</p>
        </div>
      ) : (
        <div className="space-y-3">
           <h3 className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-1 ml-3">Archives</h3>
          {myRequests.map(req => {
            const statusLineColor = req.status === 'approved' ? 'border-l-emerald-500' : 
                                  req.status === 'rejected' ? 'border-l-rose-500' : 
                                  'border-l-amber-500';
            return (
              <div key={req.id} className={`glass-card rounded-[1.5rem] p-5 border border-[var(--card-border)] border-l-[8px] hover:translate-x-1 transition-all duration-300 shadow-md group ${statusLineColor}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                       <span className="text-[8px] font-black text-brand-red uppercase tracking-widest bg-brand-red/5 px-2 py-0.5 rounded border border-brand-red/10">Remote Protocol</span>
                       <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em]">Ref: {req.id.slice(-4)}</span>
                    </div>
                    <p className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight group-hover:text-brand-red transition-colors">{req.reason}</p>
                    <div className="flex items-center gap-2 mt-2 text-brand-red/60">
                       <Calendar className="w-3 h-3" />
                       <p className="text-[9px] font-black tabular-nums tracking-widest uppercase">
                         Authorized: {formatDate(req.date)}
                       </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-[8px] font-black px-4 py-1.5 rounded-lg border uppercase tracking-widest shadow-sm block text-center ${statusColor(req.status)}`}>
                      {req.status}
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


