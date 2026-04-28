import { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { employees } from '../../data/mockData';
import SearchableSelect from '../shared/SearchableSelect';
import DatePicker from '../shared/DatePicker';
import { FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function AdminLeaveReport() {
  const { leaves } = useAppData();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('overall');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

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
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
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
    { name: 'Approved', count: summary.approved, color: '#10b981' },
    { name: 'Pending', count: summary.pending, color: '#f59e0b' },
    { name: 'Rejected', count: summary.rejected, color: '#ef4444' },
  ].filter(i => i.count > 0);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6'];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[2rem] p-6 shadow-2xl shadow-slate-200/60 border border-slate-100 border-l-8 border-l-indigo-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">From Date</label>
            <DatePicker selected={fromDate} onChange={setFromDate} placeholderText="From date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">To Date</label>
            <DatePicker selected={toDate} onChange={setToDate} placeholderText="To date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Employee</label>
            <SearchableSelect
              options={employeeOptions}
              value={employeeOptions.find(o => o.value === selectedEmployee) || null}
              onChange={opt => setSelectedEmployee(opt?.value || 'overall')}
              placeholder="Select employee..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
            <SearchableSelect
              options={statusOptions}
              value={statusOptions.find(o => o.value === selectedStatus) || null}
              onChange={opt => setSelectedStatus(opt?.value || '')}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200/60 border border-slate-100 border-l-8 border-l-indigo-600">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Leave Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200/60 border border-slate-100 border-l-8 border-l-indigo-600">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Request Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: summary.total, icon: FileText, gradient: 'from-violet-600 to-indigo-700', text: 'Requests' },
          { label: 'Approved', value: summary.approved, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-600', text: 'Requests' },
          { label: 'Rejected', value: summary.rejected, icon: XCircle, gradient: 'from-rose-500 to-red-600', text: 'Requests' },
          { label: 'Pending', value: summary.pending, icon: Clock, gradient: 'from-amber-500 to-orange-600', text: 'Requests' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-gradient-to-br ${s.gradient} p-6 rounded-[2rem] shadow-xl shadow-indigo-100/50 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/20 relative overflow-hidden group`}>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <div className="flex items-center justify-between relative z-10">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-semibold text-white/90 mb-1">{s.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-white tracking-tight">{s.value}</p>
                  <p className="text-xs font-medium text-white/60">{s.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-indigo-100 border-l-8 border-l-indigo-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-50/30 border-b border-indigo-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Dates</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(leave => (
                <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-800">{leave.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 capitalize hidden sm:table-cell">{leave.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 hidden md:table-cell">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 hidden lg:table-cell max-w-[200px] truncate">{leave.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[leave.status]}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">No records found</div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
}
