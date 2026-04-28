import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Plus, Laptop, X } from 'lucide-react';

export default function EmployeeWfh() {
  const { employee } = useAuth();
  const { wfhRequests, addWfhRequest } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
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
    addWfhRequest({
      id: `wf-${Date.now()}`,
      employeeId: employee!.id,
      employeeName: employee!.name,
      date,
      reason,
      status: 'pending',
      appliedOn: today,
    });
    setShowForm(false);
    setDate('');
    setReason('');
    setErrors({});
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Work From Home</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 shadow-sm hover:bg-emerald-600 transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" /> Request
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-6" onClick={e => e.stopPropagation()} style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Request WFH</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${errors.date ? 'border-red-300' : 'border-slate-200'}`}
                />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                  placeholder="Enter reason for WFH"
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

      {myRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
          <Laptop className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No WFH requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-800">{req.reason}</p>
                  <p className="text-xs text-slate-400 mt-2">{req.date}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor(req.status)}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
