import React, { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { employees } from '../../data/mockData';
import { IndianRupee, Receipt, FileText, Wallet, CheckCircle2, Clock } from 'lucide-react';
import SearchableSelect from '../shared/SearchableSelect';
import DatePicker from '../shared/DatePicker';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/dateUtils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const RUPEE = "\u20B9";

export default function AdminExpenseReport() {
  const { expenses } = useAppData();
  const { theme } = useTheme();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('overall');
  const [selectedType, setSelectedType] = useState<string>('');
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

  const typeOptions = useMemo(() => [
    { value: '', label: 'All Types' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food' },
    { value: 'other', label: 'Other' },
  ], []);

  const statusOptions = useMemo(() => [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ], []);

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (fromDate) {
        const from = fromDate.toISOString().split('T')[0];
        if (e.appliedOn < from) return false;
      }
      if (toDate) {
        const to = toDate.toISOString().split('T')[0];
        if (e.appliedOn > to) return false;
      }
      if (selectedEmployee !== 'overall' && e.employeeId !== selectedEmployee) return false;
      if (selectedType && e.type !== selectedType) return false;
      if (selectedStatus && e.status !== selectedStatus) return false;
      return true;
    });
  }, [expenses, fromDate, toDate, selectedEmployee, selectedType, selectedStatus]);

  const statusColors: Record<string, string> = {
    approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  };

  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);
  const approvedAmount = filtered.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = filtered.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    filtered.forEach(e => {
      data[e.type] = (data[e.type] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const employeeSpendData = useMemo(() => {
    const data: Record<string, number> = {};
    filtered.forEach(e => {
      data[e.employeeName] = (data[e.employeeName] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filtered]);

  const COLORS = ['#e11d48', '#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="glass-card p-10 rounded-[3rem] border-l-[12px] border-l-brand-red shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">Start Mark</label>
            <DatePicker selected={fromDate} onChange={setFromDate} placeholderText="From date" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">End Mark</label>
            <DatePicker selected={toDate} onChange={setToDate} placeholderText="To date" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">Unit</label>
            <SearchableSelect
              options={employeeOptions}
              value={employeeOptions.find(o => o.value === selectedEmployee) || null}
              onChange={opt => setSelectedEmployee(opt?.value || 'overall')}
              placeholder="Select employee..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-2">Type</label>
            <SearchableSelect
              options={typeOptions}
              value={typeOptions.find(o => o.value === selectedType) || null}
              onChange={opt => setSelectedType(opt?.value || '')}
              placeholder="All Types"
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
             Expense Distribution
             <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Resource Allocation</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={80} outerRadius={105} paddingAngle={10} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: tooltipBg, borderRadius: '20px', border: `1px solid ${tooltipBorder}` }}
                   formatter={(value: any) => [`${RUPEE}${Number(value).toLocaleString()}`, "Valuation"]} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 border-l-[12px] border-l-brand-red shadow-xl">
          <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center gap-3 tracking-tighter uppercase">
             Top Cumulative Spend
             <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Peak Utilization</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeSpendData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10, fontWeight: 800}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10, fontWeight: 800}} width={120} />
                <Tooltip 
                   contentStyle={{ backgroundColor: tooltipBg, borderRadius: '24px', border: `1px solid ${tooltipBorder}` }}
                   formatter={(value: any) => [`${RUPEE}${Number(value).toLocaleString()}`, "Monetary Value"]} 
                   cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                />
                <Bar dataKey="amount" fill="#e11d48" radius={[0, 15, 15, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Aggregate Expenditure', value: totalAmount, icon: Wallet, gradient: 'from-violet-600 to-indigo-700', text: 'Total Gross' },
          { label: 'Authorized Payouts', value: approvedAmount, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-600', text: 'Validated' },
          { label: 'Pending Authorization', value: pendingAmount, icon: Clock, gradient: 'from-amber-500 to-orange-600', text: 'In Queue' },
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
                  <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{RUPEE}{s.value.toLocaleString()}</p>
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
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden sm:table-cell">Protocol</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Monetary Unit</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden md:table-cell">Mission Brief</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Temporal</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {filtered.map(exp => (
                <tr key={exp.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6 text-sm font-black text-[var(--text-main)] uppercase tracking-tight group-hover:text-brand-red transition-colors">{exp.employeeName}</td>
                  <td className="px-10 py-6 text-sm font-black text-brand-red/60 uppercase tracking-widest hidden sm:table-cell">{exp.type}</td>
                  <td className="px-10 py-6 text-sm font-black text-[var(--text-main)] tabular-nums">{RUPEE}{exp.amount.toLocaleString()}</td>
                  <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] hidden md:table-cell max-w-[200px] truncate uppercase tracking-tighter">{exp.description}</td>
                  <td className="px-10 py-6 text-sm font-black text-[var(--text-muted)] tabular-nums">{formatDate(exp.appliedOn)}</td>
                  <td className="px-10 py-6">
                    <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${statusColors[exp.status]}`}>
                      {exp.status}
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
              <Receipt className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.3em] text-xs">Zero operational records detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
