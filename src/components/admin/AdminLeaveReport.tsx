import { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { employees } from '../../data/mockData';
import SearchableSelect from '../shared/SearchableSelect';
import DatePicker from '../shared/DatePicker';
import { FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/dateUtils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function AdminLeaveReport() {
  const { leaves } = useAppData();
  const { theme } = useTheme();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('overall');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const employeeOptions = useMemo(() => [
    { value: 'overall', label: 'Overall' },
    ...employees.map(e => ({ value: e.id, label: e.name })),
  ], []);

  const statusOptions = useMemo(() => [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ], []);

  const filtered = useMemo(() => {
    return leaves.filter(l => {
      if (fromDate) {
        const from = fromDate.toISOString().split('T')[0];
        if (l.startDate < from) return false;
      }
      if (toDate) {
        const to = toDate.toISOString().split('T')[0];
        if (l.startDate > to) return false;
      }
      if (selectedEmployee !== 'overall' && l.employeeId !== selectedEmployee) return false;
      if (selectedStatus && l.status !== selectedStatus) return false;
      return true;
    });
  }, [leaves, fromDate, toDate, selectedEmployee, selectedStatus]);

  const statusColors: Record<string, string> = {
    approved: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    rejected: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  };

  const summary = {
    total: filtered.length,
    approved: filtered.filter(l => l.status === 'approved').length,
    rejected: filtered.filter(l => l.status === 'rejected').length,
    pending: filtered.filter(l => l.status === 'pending').length,
  };

  const typeData = useMemo(() => {
    const data: Record<string, number> = {};
    filtered.forEach(l => {
      data[l.type] = (data[l.type] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const statusData = [
    { name: 'Approved', count: summary.approved, color: '#e11d48' },
    { name: 'Pending', count: summary.pending, color: '#f59e0b' },
    { name: 'Rejected', count: summary.rejected, color: '#64748b' },
  ].filter(i => i.count > 0);

  const COLORS = ['#e11d48', '#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="glass-card p-10 rounded-[3rem] border-l-[12px] border-l-brand-red shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">Temporal Start</label>
            <DatePicker selected={fromDate} onChange={setFromDate} placeholderText="From date" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">Temporal End</label>
            <DatePicker selected={toDate} onChange={setToDate} placeholderText="To date" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">Operational Unit</label>
            <SearchableSelect
              options={employeeOptions}
              value={employeeOptions.find(o => o.value === selectedEmployee) || null}
              onChange={opt => setSelectedEmployee(opt?.value || 'overall')}
              placeholder="Select employee..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">Auth Status</label>
            <SearchableSelect
              options={statusOptions}
              value={statusOptions.find(o => o.value === selectedStatus) || null}
              onChange={opt => setSelectedStatus(opt?.value || '')}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-[3rem] p-10 border-l-[12px] border-l-brand-red shadow-xl">
          <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center gap-3 tracking-tighter uppercase">
             Leave Type Distribution
             <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Categories</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} innerRadius={80} outerRadius={105} paddingAngle={10} dataKey="value">
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: tooltipBg, borderRadius: '20px', border: `1px solid ${tooltipBorder}` }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 border-l-[12px] border-l-brand-red shadow-xl">
          <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center gap-3 tracking-tighter uppercase">
             Request Status Overview
             <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Audit</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                   contentStyle={{ backgroundColor: tooltipBg, borderRadius: '24px', border: `1px solid ${tooltipBorder}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                   cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                />
                <Bar dataKey="count" radius={[15, 15, 0, 0]} barSize={50}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Claims', value: summary.total, icon: FileText, gradient: 'from-violet-600 to-indigo-700', text: 'Records' },
          { label: 'Approved', value: summary.approved, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-600', text: 'Validated' },
          { label: 'Rejected', value: summary.rejected, icon: XCircle, gradient: 'from-rose-500 to-red-600', text: 'Denied' },
          { label: 'Pending', value: summary.pending, icon: Clock, gradient: 'from-amber-500 to-orange-600', text: 'Queued' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-gradient-to-br ${s.gradient} p-8 rounded-[2.5rem] shadow-xl flex flex-col gap-6 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl border border-white/20 relative overflow-hidden group ring-1 ring-white/10`}>
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
              <div className="flex items-center justify-between relative z-10">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.25em] mb-2">{s.label}</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-black text-white tracking-tighter tabular-nums">{s.value}</p>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{s.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-[3.5rem] shadow-2xl border border-[var(--card-border)] border-l-[12px] border-l-brand-red overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)]">
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Personnel</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden sm:table-cell">Protocol Type</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden md:table-cell">Duration Mark</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden lg:table-cell">Mission Detail</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {filtered.map(leave => (
                <tr key={leave.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6 text-sm font-black text-[var(--text-main)] uppercase tracking-tight group-hover:text-brand-red transition-colors">{leave.employeeName}</td>
                  <td className="px-10 py-6 text-sm font-black text-brand-red/60 uppercase tracking-widest hidden sm:table-cell">{leave.type}</td>
                  <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] tabular-nums hidden md:table-cell">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</td>
                  <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] hidden lg:table-cell max-w-[200px] truncate uppercase tracking-tighter">{leave.reason}</td>
                  <td className="px-10 py-6">
                    <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${statusColors[leave.status]}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-[var(--card-border)]">
              <FileText className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.3em] text-xs">Zero archive records detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
