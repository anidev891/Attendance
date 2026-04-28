import { useAppData } from '../../context/AppDataContext';
import {
  Users, UserCheck, UserX, CalendarOff, Laptop
} from 'lucide-react';
import DashboardCharts from './DashboardCharts';

export default function AdminDashboard() {
  const { employees, attendance, leaves, wfhRequests } = useAppData();

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users, gradient: 'from-blue-600 to-blue-700', iconColor: 'text-blue-100' },
    { label: 'Today Present', value: todayAttendance.filter(a => a.status === 'present').length, icon: UserCheck, gradient: 'from-emerald-500 to-teal-600', iconColor: 'text-emerald-100' },
    { label: 'Today Absent', value: todayAttendance.filter(a => a.status === 'absent').length, icon: UserX, gradient: 'from-rose-500 to-red-600', iconColor: 'text-rose-100' },
    { label: 'On Leave', value: leaves.filter(l => l.status === 'approved' && l.startDate <= today && l.endDate >= today).length, icon: CalendarOff, gradient: 'from-amber-500 to-orange-600', iconColor: 'text-amber-100' },
    { label: 'WFH Today', value: wfhRequests.filter(w => w.status === 'approved' && w.date === today).length, icon: Laptop, gradient: 'from-indigo-500 to-purple-600', iconColor: 'text-indigo-100' },
  ];


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-slate-500 text-sm">Overview of today's organizational status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/20 relative overflow-hidden group`}>
            {/* Decorative background circle */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />

            <div className="flex items-center justify-between relative z-10">
              <div className={`p-3 rounded-2xl bg-white/20 backdrop-blur-md`}>
                <stat.icon className={`w-6 h-6 text-white`} />
              </div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-tighter">Live</span>
            </div>

            <div className="relative z-10">
              <p className="text-sm font-semibold text-white/90 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium text-white/60">Employees</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-indigo-100/50 border border-indigo-100 border-l-8 border-l-indigo-600">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Attendance</h3>
          <div className="space-y-3">
            {todayAttendance.slice(0, 5).map(record => {
              const emp = employees.find(e => e.id === record.employeeId);
              const statusColors: Record<string, string> = {
                present: 'bg-emerald-100 text-emerald-700',
                absent: 'bg-red-100 text-red-700',
                leave: 'bg-amber-100 text-amber-700',
                wfh: 'bg-blue-100 text-blue-700',
              };
              return (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                      {emp?.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{emp?.name}</p>
                      <p className="text-xs text-slate-400">{record.checkIn || '--'} - {record.checkOut || '--'}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[record.status]}`}>
                    {record.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-indigo-100/50 border border-indigo-100 border-l-8 border-l-indigo-600">
          <h3 className="font-semibold text-slate-800 mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {[
              { label: 'Leave Requests', count: leaves.filter(l => l.status === 'pending').length, color: 'text-amber-600 bg-amber-50' },
              { label: 'WFH Requests', count: wfhRequests.filter(w => w.status === 'pending').length, color: 'text-blue-600 bg-blue-50' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700">{item.label}</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${item.color}`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
