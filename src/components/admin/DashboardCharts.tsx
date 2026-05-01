import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardCharts() {
  const { attendance, expenses } = useAppData();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

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
    { name: 'Present', value: todayAttendance.filter(a => a.status === 'present').length, color: '#e11d48' },
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
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
      {/* Attendance Trends (Line Chart) */}
      <div className="glass-card p-10 rounded-[3rem] border-l-[12px] border-l-brand-red col-span-1 lg:col-span-2 relative overflow-hidden shadow-xl">
        <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center gap-3">
           Analytics Engine
           <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Operational Trends</span>
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
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

      {/* Attendance Distribution (Pie Chart) */}
      <div className="glass-card p-10 rounded-[3rem] border-l-[12px] border-l-brand-red relative overflow-hidden shadow-xl">
        <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center gap-3">
           Force Status
           <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Live</span>
        </h3>
        <div className="h-72 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={105}
                paddingAngle={10}
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderRadius: '20px', border: `1px solid ${tooltipBorder}` }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-5xl font-black text-[var(--text-main)] tracking-tighter tabular-nums">{todayAttendance.length}</p>
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Total Unit</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {attendanceData.map(item => (
            <div key={item.name} className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-[var(--card-border)]">
              <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} />
              <span className="text-[10px] text-[var(--text-main)] font-black uppercase tracking-widest">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Breakdown (Bar Chart) */}
      <div className="glass-card p-10 rounded-[3rem] border-l-[12px] border-l-brand-red col-span-1 lg:col-span-3 relative overflow-hidden shadow-xl">
        <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center gap-3">
           Capital Expenditure
           <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Audit</span>
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10, fontWeight: 800}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10, fontWeight: 800}} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderRadius: '24px', border: `1px solid ${tooltipBorder}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
              />
              <Bar dataKey="amount" radius={[15, 15, 0, 0]} barSize={50}>
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#e11d48' : (isDark ? '#334155' : '#cbd5e1')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
