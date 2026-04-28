import { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { employees } from '../../data/mockData';
import SearchableSelect from '../shared/SearchableSelect';
import DatePicker from '../shared/DatePicker';
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
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
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
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
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

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
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
          { label: 'Present', value: summary.present, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Absent', value: summary.absent, color: 'bg-red-50 text-red-700' },
          { label: 'Leave', value: summary.leave, color: 'bg-amber-50 text-amber-700' },
          { label: 'WFH', value: summary.wfh, color: 'bg-blue-50 text-blue-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
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
                  <tr key={record.id} className="hover:bg-slate-50/50">
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
