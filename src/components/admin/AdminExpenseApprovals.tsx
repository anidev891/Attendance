import { useAppData } from '../../context/AppDataContext';
import { Check, X, Receipt, IndianRupee } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AdminExpenseApprovals() {
  const { expenses, updateExpenseStatus } = useAppData();
  const { showSuccess, showError } = useNotification();
  const pending = expenses.filter(e => e.status === 'pending');
  const history = expenses.filter(e => e.status !== 'pending');

  const handleApprove = (id: string) => {
    updateExpenseStatus(id, 'approved');
    showSuccess('Expense request approved successfully');
  };

  const handleReject = (id: string) => {
    updateExpenseStatus(id, 'rejected');
    showError('Expense request has been rejected');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Pending Requests ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No pending expense requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(exp => (
              <div key={exp.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{exp.employeeName}</p>
                    <p className="text-xs text-slate-400 capitalize mt-0.5">{exp.type} Expense</p>
                    <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <IndianRupee className="w-3 h-3 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-800">{exp.amount.toLocaleString()}</span>
                    </div>
                    {exp.billFile && (
                      <p className="text-xs text-emerald-600 mt-1">Bill: {exp.billFile}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(exp.id)}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(exp.id)}
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-sm text-slate-800">{exp.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize hidden sm:table-cell">{exp.type}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">₹{exp.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          exp.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}
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
