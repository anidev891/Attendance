import { Home, CalendarOff, Laptop, Receipt, CircleUser as UserCircle, Sun, Moon, LogOut, Shield } from 'lucide-react';
import type { EmployeeTab } from '../../types';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const tabs: { id: EmployeeTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'leave', label: 'Leave', icon: CalendarOff },
  { id: 'wfh', label: 'WFH', icon: Laptop },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

export default function EmployeeLayout() {
  const { employee, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.split('/').pop() || 'home';

  const handleTabClick = (id: string) => {
    const path = id === 'home' ? '/employee' : `/employee/${id}`;
    navigate(path);
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-[var(--card-bg)] backdrop-blur-xl transition-colors duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-[var(--card-border)]">
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20 ring-1 ring-white/20">
          <span className="text-white font-black text-lg">{employee?.name.charAt(0)}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[var(--text-main)] tracking-tight uppercase italic">ATTENDANCE </span>
          <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider leading-none mt-1">Personnel</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 ${isActive
                ? 'premium-gradient text-white shadow-lg shadow-brand-red/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--card-border)] space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Ops' : 'Dark Ops'}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Terminate
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[var(--bg-main)] flex overflow-hidden text-[var(--text-main)] transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] flex-col shrink-0 relative z-40 h-full shadow-2xl transition-colors duration-300">
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        <header className="bg-[var(--card-bg)] backdrop-blur-md border-b border-[var(--card-border)] px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20 ring-1 ring-white/20">
              <span className="text-white font-black text-lg">
                {employee?.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-red uppercase tracking-[0.2em] leading-none mb-1.5">
                {activeTab === 'home' || activeTab === 'employee' ? 'Personnel Dashboard' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Protocols`}
              </p>
              <h1 className="text-base lg:text-xl font-bold text-[var(--text-main)] leading-none tracking-tight">
                {activeTab === 'home' || activeTab === 'employee' ? `Hii, ${employee?.name}` : activeTab.toUpperCase()}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-[var(--text-muted)] hover:text-brand-red transition-all border border-[var(--card-border)]"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 scroll-smooth p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto animate-slide-up">
            <Outlet />
          </div>
        </main>

        {/* Mobile/Tablet Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[var(--card-bg)] backdrop-blur-xl border-t border-[var(--card-border)] z-20 px-2 transition-colors duration-300 pb-safe">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex flex-col items-center justify-center w-14 h-12 transition-all duration-300 ${isActive ? 'text-brand-red' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
                  <span className={`text-[10px] mt-1 transition-all duration-300 ${isActive ? 'font-bold opacity-100' : 'font-medium opacity-60'}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute -top-1 w-6 h-0.5 bg-brand-red rounded-full shadow-[0_0_8px_rgba(225,29,72,0.6)]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
