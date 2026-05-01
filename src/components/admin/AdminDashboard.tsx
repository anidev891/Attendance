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
    { label: 'Total Personnel', value: employees.length, icon: Users, gradient: 'from-blue-600 to-blue-700', iconColor: 'text-blue-100' },
    { label: 'Session Active', value: todayAttendance.filter(a => a.status === 'present').length, icon: UserCheck, gradient: 'from-emerald-500 to-teal-600', iconColor: 'text-emerald-100' },
    { label: 'Absence Rate', value: todayAttendance.filter(a => a.status === 'absent').length, icon: UserX, gradient: 'from-rose-500 to-red-600', iconColor: 'text-rose-100' },
    { label: 'On Leave', value: leaves.filter(l => l.status === 'approved' && l.startDate <= today && l.endDate >= today).length, icon: CalendarOff, gradient: 'from-amber-500 to-orange-600', iconColor: 'text-amber-100' },
    { label: 'Remote Ops', value: wfhRequests.filter(w => w.status === 'approved' && w.date === today).length, icon: Laptop, gradient: 'from-indigo-500 to-purple-600', iconColor: 'text-indigo-100' },
  ];


  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Intelligence Hub</h2>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest mt-1">Real-time organizational telemetry</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-[var(--card-bg)] px-5 py-2.5 rounded-2xl border border-[var(--card-border)] backdrop-blur-md shadow-sm">
          <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
          <span className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest">Core Status: Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-[2.5rem] flex flex-col gap-5 transition-all duration-500 hover:translate-y-[-8px] hover:border-brand-red/30 relative overflow-hidden group">
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="p-3 rounded-2xl bg-brand-red/10 border border-brand-red/20 group-hover:bg-brand-red group-hover:scale-110 transition-all duration-500">
                <stat.icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors duration-500" />
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-black text-[var(--text-main)] tracking-tighter">{stat.value}</p>
                <div className="h-1.5 w-10 bg-brand-red/10 rounded-full overflow-hidden">
                   <div className="h-full premium-gradient w-3/4 shadow-[0_0_8px_rgba(225,29,72,0.4)]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-[3rem] p-10 border-l-[12px] border-l-brand-red relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-l-[16px]">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Users className="w-32 h-32 text-[var(--text-main)]" />
          </div>
          <h3 className="text-2xl font-black text-[var(--text-main)] mb-8 flex items-center gap-3">
             Recent Activity
             <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Telemetry</span>
          </h3>
          <div className="space-y-5">
            {todayAttendance.slice(0, 5).map(record => {
              const emp = employees.find(e => e.id === record.employeeId);
              const statusColors: Record<string, string> = {
                present: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/20',
                absent: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:text-rose-400 dark:border-rose-500/20',
                leave: 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/20',
                wfh: 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/20',
              };
              return (
                <div key={record.id} className="group flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-black/5 dark:hover:bg-white/5 transition-all border border-transparent hover:border-[var(--card-border)]">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-sm font-black text-[var(--text-muted)] ring-1 ring-[var(--card-border)] group-hover:ring-brand-red/30 transition-all">
                      {emp?.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--text-main)] group-hover:text-brand-red transition-colors uppercase tracking-tight">{emp?.name}</p>
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] mt-1">{record.checkIn || '--:--'} • {record.checkOut || '--:--'}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest border shadow-sm ${statusColors[record.status]}`}>
                    {record.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 border-l-[12px] border-l-brand-red relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-l-[16px]">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <CalendarOff className="w-32 h-32 text-[var(--text-main)]" />
          </div>
          <h3 className="text-2xl font-black text-[var(--text-main)] mb-8 flex items-center gap-3">
             Action Queue
             <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-red/20">Urgent</span>
          </h3>
          <div className="space-y-5">
            {[
              { label: 'Leave Requests', count: leaves.filter(l => l.status === 'pending').length, color: 'text-amber-500 border-amber-500/20 bg-amber-500/10 dark:text-amber-400', icon: CalendarOff },
              { label: 'WFH Protocol Requests', count: wfhRequests.filter(w => w.status === 'pending').length, color: 'text-blue-500 border-blue-500/20 bg-blue-500/10 dark:text-blue-400', icon: Laptop },
            ].map(item => (
              <div key={item.label} className="group flex items-center justify-between p-5 rounded-[1.5rem] bg-black/5 dark:bg-white/5 hover:bg-brand-red/5 transition-all border border-[var(--card-border)] hover:border-brand-red/30">
                <div className="flex items-center gap-5">
                   <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] group-hover:bg-brand-red/10 transition-all">
                      <item.icon className="w-6 h-6 text-[var(--text-muted)] group-hover:text-brand-red transition-colors" />
                   </div>
                   <span className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-black px-5 py-2 rounded-xl border shadow-sm ${item.color} uppercase tracking-widest`}>
                     {item.count} Pending
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
