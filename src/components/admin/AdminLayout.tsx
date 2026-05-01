import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Users, CalendarOff, Laptop, Receipt,
  FileBarChart, LogOut, Menu, X, ChevronDown, ChevronRight, Shield, Settings,
  Sun, Moon
} from 'lucide-react';
import adminMainBG from '../../assets/bgp.png';
import type { AdminSection } from '../../types';

interface MenuItem {
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
  group?: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'leave-approvals', label: 'Leave Approvals', icon: CalendarOff, group: 'approvals' },
  { id: 'wfh-approvals', label: 'WFH Approvals', icon: Laptop, group: 'approvals' },
  { id: 'expense-approvals', label: 'Expense Approvals', icon: Receipt, group: 'approvals' },
  { id: 'attendance-report', label: 'Attendance Report', icon: FileBarChart, group: 'reports' },
  { id: 'leave-report', label: 'Leave Report', icon: FileBarChart, group: 'reports' },
  { id: 'expense-report', label: 'Expense Report', icon: FileBarChart, group: 'reports' },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ approvals: true, reports: true });

  const activeSection = location.pathname.split('/').pop() || 'dashboard';

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleNav = (id: string) => {
    const path = id === 'dashboard' ? '/admin' : `/admin/${id}`;
    navigate(path);
    setSidebarOpen(false);
  };

  const groupedMenu = () => {
    const top: MenuItem[] = [];
    const groups: Record<string, MenuItem[]> = {};
    menuItems.forEach(item => {
      if (item.group) {
        if (!groups[item.group]) groups[item.group] = [];
        groups[item.group].push(item);
      } else {
        top.push(item);
      }
    });
    return { top, groups };
  };

  const { top, groups } = groupedMenu();
  const groupLabels: Record<string, string> = { approvals: 'Approvals', reports: 'Reports' };

  const sidebar = (
    <div className="flex flex-col h-full bg-[var(--card-bg)] backdrop-blur-xl transition-colors duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-[var(--card-border)]">
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20 ring-1 ring-white/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[var(--text-main)] tracking-tight uppercase italic">ATTENDANCE </span>
          <span className="text-[10px] font-bold text-brand-red uppercase tracking-[0.2em] leading-none mt-1">HQ Command</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {top.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? 'premium-gradient text-white shadow-lg shadow-brand-red/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
              {item.label}
            </button>
          );
        })}

        {Object.entries(groups).map(([groupKey, items]) => (
          <div key={groupKey} className="pt-4">
            <button
              onClick={() => toggleGroup(groupKey)}
              className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-brand-red/60 dark:text-brand-red/40 uppercase tracking-[0.2em] hover:text-brand-red transition-colors"
            >
              {groupLabels[groupKey] || groupKey}
              {expandedGroups[groupKey] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            {expandedGroups[groupKey] && (
              <div className="space-y-1 mt-2">
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${isActive
                        ? 'bg-brand-red/10 text-brand-red font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--card-border)] space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex overflow-hidden select-none bg-[var(--bg-main)] transition-colors duration-300">
      {/* Fixed Background Layer - Dark Mesh */}
      <div className="fixed inset-0 z-0 gradient-mesh opacity-50" />

      {/* Sidebar - Fixed on Desktop */}
      <aside className="hidden lg:flex w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] flex-col shrink-0 relative z-40 h-full shadow-2xl select-none transition-colors duration-300">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-[var(--card-bg)] flex flex-col z-50 animate-in slide-in-from-left duration-300 border-r border-[var(--card-border)] transition-colors duration-300">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        <header className="bg-[var(--card-bg)] backdrop-blur-xl border-b border-[var(--card-border)] px-4 lg:px-8 py-5 flex items-center justify-between sticky top-0 z-30 shrink-0 select-none transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
                {menuItems.find(m => m.id === activeSection)?.label || 'Dashboard'}
              </h1>
              <p className="text-[10px] font-bold text-brand-red uppercase tracking-[0.2em] leading-none mt-1">Administrator Control Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-[var(--text-muted)] hover:text-brand-red transition-all border border-[var(--card-border)]"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 select-auto scroll-smooth">
          <div className="max-w-[1600px] mx-auto animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
