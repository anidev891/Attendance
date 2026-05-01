import { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { employees } from '../../data/mockData';
import SearchableSelect from '../shared/SearchableSelect';
import DatePicker from '../shared/DatePicker';
import { UserCheck, UserX, Calendar, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/dateUtils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

export default function AdminAttendanceReport() {
  const { attendance } = useAppData();
  const { theme } = useTheme();
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('overall');

  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const employeeOptions = useMemo(() => [
    { value: 'overall', label: 'Overall' },
    ...employees.map(e => ({ value: e.id, label: e.name })),
  ], []);

  const filtered = useMemo(() => {
    return attendance.filter(a => {
      if (fromDate) {
        const from = fromDate.toISOString().split('T')[0];
        if (a.date < from) return false;
      }
      if (toDate) {
        const to = toDate.toISOString().split('T')[0];
        if (a.date > to) return false;
      }
      if (selectedEmployee !== 'overall' && a.employeeId !== selectedEmployee) return false;
      return true;
    });
  }, [attendance, fromDate, toDate, selectedEmployee]);

  const statusColors: Record<string, string> = {
    present: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    absent: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
    leave: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    wfh: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  };

  const summary = {
    present: filtered.filter(a => a.status === 'present').length,
    absent: filtered.filter(a => a.status === 'absent').length,
    leave: filtered.filter(a => a.status === 'leave').length,
    wfh: filtered.filter(a => a.status === 'wfh').length,
  };

  const chartData = [
    { name: 'Present', value: summary.present, color: '#e11d48' },
    { name: 'Absent', value: summary.absent, color: '#ef4444' },
    { name: 'Leave', value: summary.leave, color: '#f59e0b' },
    { name: 'WFH', value: summary.wfh, color: '#3b82f6' },
  ].filter(i => i.value > 0);

  // Group by date for line chart
  const timelineData = useMemo(() => {
    const dates = [...new Set(filtered.map(a => a.date))].sort();
    return dates.map(date => ({
      date: date.split('-').slice(1).join('/'),
      present: filtered.filter(a => a.date === date && a.status === 'present').length,
      absent: filtered.filter(a => a.date === date && a.status === 'absent').length,
    }));
  }, [filtered]);

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
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">Operational Unit</label>
            <SearchableSelect
              options={employeeOptions}
              value={employeeOptions.find(o => o.value === selectedEmployee) || null}
              onChange={opt => setSelectedEmployee(opt?.value || 'overall')}
              placeholder="Select employee..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-[3rem] p-10 border-l-[12px] border-l-brand-red shadow-xl">
          <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center gap-3 tracking-tighter uppercase">
             Attendance Timeline
             <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Chronological</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderRadius: '24px', border: `1px solid ${tooltipBorder}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  labelStyle={{ color: '#e11d48', fontWeight: '900', marginBottom: '8px', fontSize: '10px' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '30px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '2px' }} />
                <Line type="monotone" dataKey="present" stroke="#e11d48" strokeWidth={5} dot={{ r: 6, fill: '#e11d48', strokeWidth: 3, stroke: tooltipBg }} activeDot={{ r: 8, strokeWidth: 0, fill: '#e11d48' }} />
                <Line type="monotone" dataKey="absent" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth={5} dot={{ r: 6, fill: isDark ? '#334155' : '#cbd5e1', strokeWidth: 3, stroke: tooltipBg }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 border-l-[12px] border-l-brand-red shadow-xl">
          <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center gap-3 tracking-tighter uppercase">
             Distribution
             <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Telemetry</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={80} outerRadius={105} paddingAngle={10} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderRadius: '20px', border: `1px solid ${tooltipBorder}` }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: 'Present', value: summary.present, icon: UserCheck, gradient: 'from-emerald-500 to-teal-600', text: 'Confirmed' },
          { label: 'Absent', value: summary.absent, icon: UserX, gradient: 'from-rose-500 to-red-600', text: 'Deficit' },
          { label: 'Leave', value: summary.leave, icon: Calendar, gradient: 'from-amber-500 to-orange-600', text: 'Off-Grid' },
          { label: 'WFH', value: summary.wfh, icon: Laptop, gradient: 'from-blue-500 to-indigo-600', text: 'Remote' },
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
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Personnel Identity</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Temporal Mark</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden sm:table-cell">Initial Entry</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden sm:table-cell">Final Exit</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Status Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {filtered.map(record => {
                const emp = employees.find(e => e.id === record.employeeId);
                return (
                  <tr key={record.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-6 text-sm font-black text-[var(--text-main)] uppercase tracking-tight group-hover:text-brand-red transition-colors">{emp?.name || 'Unknown'}</td>
                    <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] tabular-nums">{formatDate(record.date)}</td>
                    <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] hidden sm:table-cell tabular-nums">{record.checkIn || '--:--'}</td>
                    <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] hidden sm:table-cell tabular-nums">{record.checkOut || '--:--'}</td>
                    <td className="px-10 py-6">
                      <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${statusColors[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-[var(--card-border)]">
              <Calendar className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.3em] text-xs">Zero operational records detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
