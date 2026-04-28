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
    { label: 'Total Employees', value: employees.length, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Today Present', value: todayAttendance.filter(a => a.status === 'present').length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Today Absent', value: todayAttendance.filter(a => a.status === 'absent').length, icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'On Leave', value: leaves.filter(l => l.status === 'approved' && l.startDate <= today && l.endDate >= today).length, icon: CalendarOff, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'WFH Today', value: wfhRequests.filter(w => w.status === 'approved' && w.date === today).length, icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-50' },
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
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
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

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
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
