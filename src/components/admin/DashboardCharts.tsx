import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { useAppData } from '../../context/AppDataContext';

export default function DashboardCharts() {
  const { attendance, expenses } = useAppData();

  // 1. Bar Chart Data: Expenses by Category
  const expenseData = expenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.type);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ name: curr.type, amount: curr.amount });
    }
    return acc;
  }, []);

  // 2. Pie Chart Data: Today's Attendance Distribution
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const attendanceData = [
    { name: 'Present', value: todayAttendance.filter(a => a.status === 'present').length, color: '#10b981' },
    { name: 'Absent', value: todayAttendance.filter(a => a.status === 'absent').length, color: '#ef4444' },
    { name: 'Leave', value: todayAttendance.filter(a => a.status === 'leave').length, color: '#f59e0b' },
    { name: 'WFH', value: todayAttendance.filter(a => a.status === 'wfh').length, color: '#3b82f6' },
  ].filter(item => item.value > 0);

  // 3. Line Chart Data: 7-Day Attendance Trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const trendData = last7Days.map(date => {
    const dayAttendance = attendance.filter(a => a.date === date);
    return {
      date: date.split('-').slice(1).join('/'),
      present: dayAttendance.filter(a => a.status === 'present').length,
      absent: dayAttendance.filter(a => a.status === 'absent').length,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      {/* Attendance Trends (Line Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2">
        <h3 className="font-semibold text-slate-800 mb-6">Attendance Trends (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Distribution (Pie Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-6">Today's Distribution</h3>
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-2xl font-bold text-slate-800">{todayAttendance.length}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {attendanceData.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-600 font-medium">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Breakdown (Bar Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-3">
        <h3 className="font-semibold text-slate-800 mb-6">Expense Breakdown by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7', '#ec4899'][index % 3]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
