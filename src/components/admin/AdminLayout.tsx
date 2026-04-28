import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, CalendarOff, Laptop, Receipt,
  FileBarChart, LogOut, Menu, X, ChevronDown, ChevronRight, Shield, Settings
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
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-2 border-b border-slate-700/50">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white">AttendX</span>
        <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full ml-auto">Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {top.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}

        {Object.entries(groups).map(([groupKey, items]) => (
          <div key={groupKey} className="pt-2">
            <button
              onClick={() => toggleGroup(groupKey)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
            >
              {groupLabels[groupKey] || groupKey}
              {expandedGroups[groupKey] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            {expandedGroups[groupKey] && (
              <div className="space-y-1 mt-1">
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${isActive
                          ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50 pl-6'
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

      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex overflow-hidden select-none bg-slate-50/50">
      {/* Fixed Background Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${adminMainBG})` }}
      />
      <div className="fixed inset-0 z-0 bg-indigo-100/40" />

      {/* Sidebar - Fixed on Desktop */}
      <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-indigo-900/50 flex-col shrink-0 relative z-40 h-full shadow-2xl select-none">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-slate-950 flex flex-col z-50 animate-in slide-in-from-left duration-300">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-indigo-50/30">
        <header className="bg-white/95 backdrop-blur-md border-b border-indigo-100 px-4 lg:px-6 py-4 flex items-center gap-3 sticky top-0 z-30 shadow-sm shrink-0 select-none">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            {menuItems.find(m => m.id === activeSection)?.label || 'Dashboard'}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 select-auto">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
