import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Laptop, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

export default function AdminWfhApprovals() {
  const { wfhRequests, updateWfhStatus } = useAppData();
  const { locationBoundary, setLocationBoundary } = useAuth();
  const { showSuccess, showError, confirm } = useNotification();
  const [editingBoundary, setEditingBoundary] = useState(false);
  const [radius, setRadius] = useState(locationBoundary.radius.toString());

  const pending = wfhRequests.filter(r => r.status === 'pending');
  const history = wfhRequests.filter(r => r.status !== 'pending');

  const handleSaveBoundary = () => {
    const r = parseInt(radius);
    if (r > 0) {
      setLocationBoundary({ ...locationBoundary, radius: r });
      setEditingBoundary(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] p-6 shadow-2xl shadow-slate-200/60 border border-slate-100 border-l-4 border-l-indigo-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-slate-800">Office Location Boundary</span>
          </div>
          <button
            onClick={() => setEditingBoundary(!editingBoundary)}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {editingBoundary ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Lat: {locationBoundary.latitude.toFixed(4)}, Lon: {locationBoundary.longitude.toFixed(4)} | Radius: {locationBoundary.radius}m
        </p>
        {editingBoundary && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              value={radius}
              onChange={e => setRadius(e.target.value)}
              className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <span className="text-sm text-slate-500">meters</span>
            <button
              onClick={handleSaveBoundary}
              className="px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Pending Requests ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-8 text-center border border-slate-100 shadow-2xl shadow-slate-200/60">
            <Laptop className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold">No pending WFH requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(req => (
               <div key={req.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 border-l-4 border-l-indigo-500 hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{req.employeeName}</p>
                    <p className="text-sm text-slate-600 mt-1">{req.reason}</p>
                    <p className="text-xs text-slate-400 mt-1">{req.date}</p>
                    <p className="text-xs text-blue-500 mt-1 italic">Approved WFH disables location restriction for this employee</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      onClick={() => confirm({
                        title: 'Approve WFH?',
                        message: 'Are you sure you want to approve this work from home request?',
                        type: 'success',
                        onConfirm: () => {
                          updateWfhStatus(req.id, 'approved');
                          showSuccess('WFH request approved');
                        }
                      })}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => confirm({
                        title: 'Reject WFH?',
                        message: 'Are you sure you want to reject this work from home request?',
                        type: 'danger',
                        onConfirm: () => {
                          updateWfhStatus(req.id, 'rejected');
                          showError('WFH request rejected');
                        }
                      })}
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-800">{req.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">{req.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
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
