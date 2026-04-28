import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Laptop, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function AdminWfhApprovals() {
  const { wfhRequests, updateWfhStatus } = useAppData();
  const { locationBoundary, setLocationBoundary } = useAuth();
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
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
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
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <Laptop className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No pending WFH requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{req.employeeName}</p>
                    <p className="text-sm text-slate-600 mt-1">{req.reason}</p>
                    <p className="text-xs text-slate-400 mt-1">{req.date}</p>
                    <p className="text-xs text-blue-500 mt-1 italic">Approved WFH disables location restriction for this employee</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateWfhStatus(req.id, 'approved')}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateWfhStatus(req.id, 'rejected')}
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50">
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
