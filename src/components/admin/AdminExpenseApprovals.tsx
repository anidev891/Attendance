import { useAppData } from '../../context/AppDataContext';
import { Check, X, Receipt, IndianRupee } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

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
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Pending Requests ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-8 text-center border border-slate-100 shadow-2xl shadow-slate-200/60">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold">No pending expense requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(exp => (
              <div key={exp.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 border-l-4 border-l-indigo-500 hover:scale-[1.01] transition-all duration-300">
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
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(exp.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(exp.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      <X className="w-3.5 h-3.5" />
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
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">History</h3>
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
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
