import { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { employees } from '../../data/mockData';
import SearchableSelect from '../shared/SearchableSelect';
import DatePicker from '../shared/DatePicker';
import { UserCheck, UserX, Calendar, Laptop } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

export default function AdminAttendanceReport() {
  const { attendance } = useAppData();
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('overall');

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
    present: 'bg-emerald-100 text-emerald-700',
    absent: 'bg-red-100 text-red-700',
    leave: 'bg-amber-100 text-amber-700',
    wfh: 'bg-blue-100 text-blue-700',
  };

  const summary = {
    present: filtered.filter(a => a.status === 'present').length,
    absent: filtered.filter(a => a.status === 'absent').length,
    leave: filtered.filter(a => a.status === 'leave').length,
    wfh: filtered.filter(a => a.status === 'wfh').length,
  };

  const chartData = [
    { name: 'Present', value: summary.present, color: '#10b981' },
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
    <div className="space-y-4">
      <div className="bg-white rounded-[2rem] p-6 shadow-2xl shadow-slate-200/60 border border-slate-100 border-l-8 border-l-indigo-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">From Date</label>
            <DatePicker selected={fromDate} onChange={setFromDate} placeholderText="From date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">To Date</label>
            <DatePicker selected={toDate} onChange={setToDate} placeholderText="To date" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Employee</label>
            <SearchableSelect
              options={employeeOptions}
              value={employeeOptions.find(o => o.value === selectedEmployee) || null}
              onChange={opt => setSelectedEmployee(opt?.value || 'overall')}
              placeholder="Select employee..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-white/40 border-l-8 border-l-indigo-600">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Attendance Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-2xl shadow-slate-200/60 border border-slate-100 border-l-8 border-l-indigo-600">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Present', value: summary.present, icon: UserCheck, gradient: 'from-emerald-500 to-teal-600', text: 'Employees' },
          { label: 'Absent', value: summary.absent, icon: UserX, gradient: 'from-rose-500 to-red-600', text: 'Employees' },
          { label: 'Leave', value: summary.leave, icon: Calendar, gradient: 'from-amber-500 to-orange-600', text: 'Requests' },
          { label: 'WFH', value: summary.wfh, icon: Laptop, gradient: 'from-blue-500 to-indigo-600', text: 'Requests' },
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Check In</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Check Out</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(record => {
                const emp = employees.find(e => e.id === record.employeeId);
                return (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-800">{emp?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{formatDate(record.date)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">{record.checkIn || '--'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">{record.checkOut || '--'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[record.status]}`}>
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
