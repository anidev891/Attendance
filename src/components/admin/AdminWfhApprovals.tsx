import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Laptop, MapPin, Save } from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

import { formatDate } from '../../utils/dateUtils';

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
      showSuccess('Operational boundary updated');
    }
  };

  return (
    <div className="space-y-12 animate-slide-up">
      <div className="glass-card rounded-[2.5rem] p-8 border border-[var(--card-border)] border-l-[12px] border-l-brand-red shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-red/10 rounded-xl">
               <MapPin className="w-5 h-5 text-brand-red" />
            </div>
            <div>
               <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Operational Geofence</span>
               <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">Office Location Boundary</h4>
            </div>
          </div>
          <button
            onClick={() => setEditingBoundary(!editingBoundary)}
            className="text-[10px] font-black text-brand-red hover:text-rose-600 uppercase tracking-widest bg-brand-red/5 px-4 py-2 rounded-xl border border-brand-red/10 transition-colors"
          >
            {editingBoundary ? 'Cancel Protocol' : 'Modify Boundary'}
          </button>
        </div>
        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest tabular-nums bg-black/5 dark:bg-white/5 p-4 rounded-2xl inline-block">
          LAT: {locationBoundary.latitude.toFixed(4)} <span className="mx-2 opacity-30">|</span> LON: {locationBoundary.longitude.toFixed(4)} <span className="mx-2 opacity-30">|</span> RADIUS: {locationBoundary.radius}M
        </p>
        {editingBoundary && (
          <div className="mt-6 flex items-center gap-4 animate-slide-up">
            <div className="relative">
               <input
                 type="number"
                 value={radius}
                 onChange={e => setRadius(e.target.value)}
                 className="w-40 px-6 py-4 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-2xl text-sm font-black text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all placeholder:text-[var(--text-muted)]"
                 placeholder="Radius (m)"
               />
               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">METERS</span>
            </div>
            <button
              onClick={handleSaveBoundary}
              className="flex items-center gap-2 px-8 py-4 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-brand-red/20"
            >
              <Save className="w-4 h-4" />
              Commit Changes
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6 ml-4">WFH Authorization Queue ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="glass-card rounded-[3rem] p-20 text-center border-[var(--card-border)] shadow-2xl">
            <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-[var(--card-border)]">
              <Laptop className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.3em] text-xs">Zero pending remote requests</p>
          </div>
        ) : (
          <div className="space-y-5">
            {pending.map(req => (
               <div key={req.id} className="glass-card rounded-[2.5rem] p-8 border border-[var(--card-border)] border-l-[12px] border-l-brand-red hover:translate-x-2 transition-all duration-500 shadow-xl group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                       <p className="text-xl font-black text-[var(--text-main)] tracking-tight uppercase group-hover:text-brand-red transition-colors">{req.employeeName}</p>
                       <span className="text-[9px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">WFH Protocol</span>
                    </div>
                    <p className="text-sm font-black text-[var(--text-muted)] uppercase tracking-tight leading-relaxed mb-4">{req.reason}</p>
                    <div className="flex flex-wrap items-center gap-4">
                       <span className="text-[10px] font-black text-brand-red/60 uppercase tracking-widest tabular-nums">Requested Date: {formatDate(req.date)}</span>
                       <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 italic">Geofence bypass enabled upon authorization</span>
                    </div>
                  </div>
                  <div className="flex gap-4 shrink-0">
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
                      className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 ring-1 ring-white/20"
                    >
                      <Check className="w-4 h-4" />
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
                      className="flex items-center gap-3 px-8 py-4 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] hover:bg-brand-red hover:text-white hover:border-brand-red text-brand-red rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                    >
                      <X className="w-4 h-4" />
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
          <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6 ml-4">Authorization History</h3>
          <div className="glass-card rounded-[3.5rem] shadow-2xl border border-[var(--card-border)] border-l-[12px] border-l-brand-red overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)]">
                    <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Personnel</th>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden sm:table-cell">Temporal Mark</th>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Auth Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {history.map(req => (
                    <tr key={req.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-6 text-sm font-black text-[var(--text-main)] uppercase tracking-tight group-hover:text-brand-red transition-colors">{req.employeeName}</td>
                      <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] tabular-nums hidden sm:table-cell">{formatDate(req.date)}</td>
                      <td className="px-10 py-6">
                        <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${
                          req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {req.status}
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


