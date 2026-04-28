import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Plus, Calendar, X, Clock, Heart, ShieldCheck, CheckCircle2, WalletCards } from 'lucide-react';
import type { LeaveRequest } from '../../types';
import SearchableSelect from '../shared/SearchableSelect';

export default function EmployeeLeave() {
  const { employee } = useAuth();
  const { leaves, addLeave } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<LeaveRequest['type']>('casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const leaveStats = [
    { label: 'Pending', value: pendingCount, total: null, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Casual', value: getUsedCount('casual'), total: 12, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sick', value: getUsedCount('sick'), total: 10, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Privilege', value: getUsedCount('earned'), total: 15, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const leaveTypeOptions = useMemo(() => [
    { value: 'casual', label: 'Casual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'earned', label: 'Earned Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
  ], []);

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
    addLeave({
      id: `lr-${Date.now()}`,
      employeeId: employee!.id,
      employeeName: employee!.name,
      type,
      startDate,
      endDate,
      reason,
      status: 'pending',
      appliedOn: today,
    });
    setShowForm(false);
    setType('casual');
    setStartDate('');
    setEndDate('');
    setReason('');
    setErrors({});
  };

  const statusColor = (s: LeaveRequest['status']) => {
    switch (s) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const typeLabel = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Leave Requests</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 shadow-sm hover:bg-emerald-600 transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" /> Apply
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Pending', value: pendingCount, total: null, icon: Clock, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
          { label: 'Casual', value: getUsedCount('casual'), total: 12, icon: Heart, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
          { label: 'Sick', value: getUsedCount('sick'), total: 10, icon: ShieldCheck, gradient: 'from-rose-500 to-red-600', shadow: 'shadow-rose-500/20' },
          { label: 'Privilege', value: getUsedCount('earned'), total: 15, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.gradient} rounded-[1.75rem] p-5 text-white shadow-lg ${stat.shadow} relative overflow-hidden group`}>
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <div className="relative z-10">
                <div className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/80 mb-1">{stat.label} Leave</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{stat.value}</span>
                  {stat.total && <span className="text-xs font-bold text-white/60">/ {stat.total}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-6" onClick={e => e.stopPropagation()} style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Apply for Leave</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
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
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                          isSelected 
                            ? `border-${opt.color}-500 bg-${opt.color}-50` 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? `bg-${opt.color}-500 text-white` : 'bg-slate-50 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isSelected ? `text-${opt.color}-700` : 'text-slate-700'}`}>
                            {opt.label}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Leave</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.startDate ? 'border-red-300' : 'border-slate-200'}`}
                  />
                  {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.endDate ? 'border-red-300' : 'border-slate-200'}`}
                  />
                  {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                  placeholder="Enter reason for leave"
                  className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none ${errors.reason ? 'border-red-300' : 'border-slate-200'}`}
                />
                {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {myLeaves.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No leave requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myLeaves.map(leave => {
            const statusLineColor = leave.status === 'approved' ? 'border-l-emerald-500' : 
                                  leave.status === 'rejected' ? 'border-l-rose-500' : 
                                  'border-l-amber-500';
            return (
              <div key={leave.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 border-l-4 ${statusLineColor}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{typeLabel(leave.type)} Leave</span>
                    <p className="text-sm text-slate-800 mt-1 font-semibold">{leave.reason}</p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {leave.startDate} to {leave.endDate}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${statusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
