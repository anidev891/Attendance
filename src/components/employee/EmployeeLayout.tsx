import { Home, CalendarOff, Laptop, Receipt, CircleUser as UserCircle } from 'lucide-react';
import type { EmployeeTab } from '../../types';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const tabs: { id: EmployeeTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'leave', label: 'Leave', icon: CalendarOff },
  { id: 'wfh', label: 'WFH', icon: Laptop },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

export default function EmployeeLayout() {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.split('/').pop() || 'home';

  const handleTabClick = (id: string) => {
    const path = id === 'home' ? '/employee' : `/employee/${id}`;
    navigate(path);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col max-w-lg mx-auto overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-slate-800">AttendX</span>
        </div>
        <div className="text-xs font-bold text-slate-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {employee?.name.split(' ')[0]}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-slate-200 z-20">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex-1 flex flex-col items-center py-2.5 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
