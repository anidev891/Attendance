import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Plus, Calendar, X } from 'lucide-react';
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <SearchableSelect
                  options={leaveTypeOptions}
                  value={leaveTypeOptions.find(o => o.value === type) || null}
                  onChange={opt => setType((opt?.value || 'casual') as LeaveRequest['type'])}
                  placeholder="Select leave type..."
                />
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
          {myLeaves.map(leave => (
            <div key={leave.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{typeLabel(leave.type)} Leave</span>
                  <p className="text-sm text-slate-800 mt-1">{leave.reason}</p>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {leave.startDate} to {leave.endDate}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor(leave.status)}`}>
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
