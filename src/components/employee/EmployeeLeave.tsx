import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Plus, Calendar, X, Clock, Heart, ShieldCheck, CheckCircle2, WalletCards, Send } from 'lucide-react';
import type { LeaveRequest } from '../../types';
import DatePicker from '../shared/DatePicker';

import { formatDate } from '../../utils/dateUtils';

export default function EmployeeLeave() {
  const { employee } = useAuth();
  const { leaves, addLeave } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<LeaveRequest['type']>('casual');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const myLeaves = leaves.filter(l => l.employeeId === employee?.id);
  const pendingCount = myLeaves.filter(l => l.status === 'pending').length;
  
  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getUsedCount = (type: string) => {
    return myLeaves
      .filter(l => l.type === type && l.status === 'approved')
      .reduce((sum, l) => sum + calculateDays(l.startDate, l.endDate), 0);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!startDate) e.startDate = 'Start date is required';
    if (!endDate) e.endDate = 'End date is required';
    if (!reason.trim()) e.reason = 'Reason is required';
    if (startDate && endDate && startDate > endDate) e.endDate = 'End date must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const today = new Date().toISOString().split('T')[0];
    const startStr = startDate!.toISOString().split('T')[0];
    const endStr = endDate!.toISOString().split('T')[0];
    
    addLeave({
      id: `lr-${Date.now()}`,
      employeeId: employee!.id,
      employeeName: employee!.name,
      type,
      startDate: startStr,
      endDate: endStr,
      reason,
      status: 'pending',
      appliedOn: today,
    });
    setShowForm(false);
    setType('casual');
    setStartDate(null);
    setEndDate(null);
    setReason('');
    setErrors({});
  };

  const statusColor = (s: LeaveRequest['status']) => {
    switch (s) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  const typeLabel = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-[var(--text-main)] uppercase tracking-tight">Leave Protocols</h2>
        <button
          onClick={() => setShowForm(true)}
          className="premium-gradient text-white px-6 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-brand-red/10 hover:shadow-brand-red/20 transition-all active:scale-95 ring-1 ring-white/10"
        >
          <Plus className="w-3.5 h-3.5" /> Initialize
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Pending Auth', value: pendingCount, total: null, icon: Clock, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/10' },
          { label: 'Casual', value: getUsedCount('casual'), total: 12, icon: Heart, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/10' },
          { label: 'Medical', value: getUsedCount('sick'), total: 10, icon: ShieldCheck, gradient: 'from-rose-500 to-red-600', shadow: 'shadow-rose-500/10' },
          { label: 'Earned', value: getUsedCount('earned'), total: 15, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/10' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.gradient} rounded-[1.5rem] p-4 text-white shadow-md ${stat.shadow} relative overflow-hidden group border border-white/5`}>
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
              <div className="relative z-10">
                <div className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center mb-3 backdrop-blur-md border border-white/30">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-[8px] font-black uppercase tracking-[0.1em] text-white/80 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black tabular-nums">{stat.value}</span>
                  {stat.total && <span className="text-[10px] font-black text-white/50 tracking-widest">/ {stat.total}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 dark:bg-brand-dark/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-[var(--card-border)]" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-[var(--card-border)] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
              <div>
                <h3 className="font-black text-xl text-[var(--text-main)] tracking-tighter uppercase">Protocol Initiation</h3>
                <p className="text-[8px] font-black text-brand-red uppercase tracking-[0.2em] mt-1">Absence Request</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-brand-red group rounded-xl transition-all border border-[var(--card-border)]">
                <X className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2 mb-3 block">Protocol Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'casual', label: 'Casual', icon: Heart, color: 'emerald' },
                    { id: 'sick', label: 'Sick', icon: ShieldCheck, color: 'rose' },
                    { id: 'earned', label: 'Privilege', icon: CheckCircle2, color: 'blue' },
                    { id: 'unpaid', label: 'Unpaid', icon: WalletCards, color: 'slate' },
                  ].map(opt => {
                    const Icon = opt.icon;
                    const isSelected = type === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setType(opt.id as LeaveRequest['type'])}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left group ${
                          isSelected 
                            ? 'border-brand-red bg-brand-red/5' 
                            : 'border-[var(--card-border)] bg-black/5 dark:bg-white/5 hover:border-brand-red/30'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isSelected ? 'bg-brand-red text-white scale-110 shadow-lg shadow-brand-red/10' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                            {opt.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Start</label>
                  <DatePicker selected={startDate} onChange={setStartDate} placeholderText="Start date" className={errors.startDate ? 'border-rose-500' : ''} />
                  {errors.startDate && <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.startDate}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">End</label>
                  <DatePicker selected={endDate} onChange={setEndDate} placeholderText="End date" className={errors.endDate ? 'border-rose-500' : ''} />
                  {errors.endDate && <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.endDate}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Justification</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                  placeholder="Justification Narrative..."
                  className={`glass-input w-full px-4 py-3 rounded-xl text-xs font-black tracking-tight resize-none placeholder:text-[var(--text-muted)] ${errors.reason ? 'border-rose-500' : ''}`}
                />
                {errors.reason && <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.reason}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-4 premium-gradient text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-brand-red/10 flex items-center justify-center gap-2 active:scale-[0.98] ring-1 ring-white/10"
              >
                <Send className="w-4 h-4" />
                Transmit
              </button>
            </form>
          </div>
        </div>
      )}

      {myLeaves.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-12 text-center border-[var(--card-border)] shadow-lg">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-[var(--card-border)]">
             <Calendar className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px]">Zero historical records</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-1 ml-3">Archives</h3>
          {myLeaves.map(leave => {
            const statusLineColor = leave.status === 'approved' ? 'border-l-emerald-500' : 
                                  leave.status === 'rejected' ? 'border-l-rose-500' : 
                                  'border-l-amber-500';
            return (
              <div key={leave.id} className={`glass-card rounded-[1.5rem] p-5 border border-[var(--card-border)] border-l-[8px] hover:translate-x-1 transition-all duration-300 shadow-md group ${statusLineColor}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                       <span className="text-[8px] font-black text-brand-red uppercase tracking-widest bg-brand-red/5 px-2 py-0.5 rounded border border-brand-red/10">{typeLabel(leave.type)}</span>
                       <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em]">Ref: {leave.id.slice(-4)}</span>
                    </div>
                    <p className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight group-hover:text-brand-red transition-colors">{leave.reason}</p>
                    <div className="flex items-center gap-2 mt-2 text-brand-red/60">
                       <Calendar className="w-3 h-3" />
                       <p className="text-[9px] font-black tabular-nums tracking-widest uppercase">
                         {formatDate(leave.startDate)} <span className="opacity-30">/</span> {formatDate(leave.endDate)}
                       </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-[8px] font-black px-4 py-1.5 rounded-lg border uppercase tracking-widest shadow-sm block text-center ${statusColor(leave.status)}`}>
                      {leave.status}
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
