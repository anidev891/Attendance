import { useAppData } from '../../context/AppDataContext';
import { Check, X, CalendarOff } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AdminLeaveApprovals() {
  const { leaves, updateLeaveStatus } = useAppData();
  const { showSuccess, showError } = useNotification();
  const pending = leaves.filter(l => l.status === 'pending');
  const history = leaves.filter(l => l.status !== 'pending');

  const handleApprove = (id: string) => {
    updateLeaveStatus(id, 'approved');
    showSuccess('Leave request approved successfully');
  };

  const handleReject = (id: string) => {
    updateLeaveStatus(id, 'rejected');
    showError('Leave request has been rejected');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Pending Requests ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <CalendarOff className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No pending leave requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(leave => (
              <div key={leave.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{leave.employeeName}</p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{leave.type} Leave</p>
                    <p className="text-sm text-slate-600 mt-2">{leave.reason}</p>
                    <p className="text-xs text-slate-400 mt-1">{leave.startDate} to {leave.endDate}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(leave.id)}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(leave.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                    >
                      <X className="w-4 h-4" />
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
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">History</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Dates</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map(leave => (
                    <tr key={leave.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-sm text-slate-800">{leave.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize hidden sm:table-cell">{leave.type}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden md:table-cell">{leave.startDate} - {leave.endDate}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
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
