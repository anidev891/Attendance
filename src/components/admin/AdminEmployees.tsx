import { useAppData } from '../../context/AppDataContext';
import { Search, Plus, X, User, Edit2, Trash2, UserMinus, UserCheck, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import type { Employee } from '../../types';

export default function AdminEmployees() {
  const { employees, attendance, addEmployee, updateEmployee, deleteEmployee } = useAppData();
  const { showSuccess, showInfo, showWarning, showDanger, confirm } = useNotification();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    phone: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleOpenModal = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({
        name: emp.name,
        email: emp.email,
        department: emp.department,
        designation: emp.designation,
        phone: emp.phone,
      });
    } else {
      setEditingEmployee(null);
      setFormData({ name: '', email: '', department: '', designation: '', phone: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        ...formData,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      });
      showSuccess('Employee details updated');
    } else {
      const employee: Employee = {
        ...formData,
        id: `emp-${Date.now()}`,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      addEmployee(employee);
      showSuccess('New employee added successfully');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete Employee?',
      message: 'Are you sure you want to delete this employee? This action cannot be undone and all associated records will be lost.',
      type: 'danger',
      onConfirm: () => {
        deleteEmployee(id);
        showDanger('Employee record deleted');
      }
    });
  };

  const toggleStatus = (emp: Employee) => {
    const newStatus = emp.status === 'active' ? 'inactive' : 'active';
    updateEmployee(emp.id, { status: newStatus });
    if (newStatus === 'active') showSuccess(`${emp.name} is now Active`);
    else showWarning(`${emp.name} is now Inactive`);
  };

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const getAttendanceStatus = (empId: string) => {
    const record = attendance.find(a => a.employeeId === empId && a.date === today);
    return record?.status || 'absent';
  };

  const attendanceColors: Record<string, string> = {
    present: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    absent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    leave: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    wfh: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search operational units..."
            className="glass-input w-full pl-14 pr-4 py-4 rounded-2xl text-sm font-black uppercase tracking-tight shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => handleOpenModal()}
            className="flex-1 sm:flex-none premium-gradient text-white px-10 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand-red/20 active:scale-95 uppercase tracking-[0.2em] ring-1 ring-white/20"
          >
            <Plus className="w-5 h-5" />
            Initialize Personnel
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border border-[var(--card-border)] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)]">
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Designation ID</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] hidden lg:table-cell">Division / Role</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Telemetry</th>
                <th className="text-left px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Auth Status</th>
                <th className="text-right px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {filtered.map(emp => {
                const attStatus = getAttendanceStatus(emp.id);
                const isActive = emp.status === 'active';
                return (
                  <tr key={emp.id} className={`group hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors ${!isActive ? 'opacity-40 grayscale-[0.8]' : ''}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 ring-1 ring-[var(--card-border)] transition-all group-hover:ring-brand-red/30 shadow-sm ${isActive ? 'premium-gradient text-white shadow-brand-red/20' : 'bg-black/5 dark:bg-slate-900 text-[var(--text-muted)]'}`}>
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[var(--text-main)] group-hover:text-brand-red transition-colors uppercase tracking-tight">{emp.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-brand-red/60" />
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{emp.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 hidden lg:table-cell">
                      <p className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">{emp.designation}</p>
                      <p className="text-[10px] font-black text-brand-red/60 uppercase tracking-[0.15em] mt-1">{emp.department}</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border shadow-sm ${attendanceColors[attStatus]}`}>
                        {attStatus}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <button 
                        onClick={() => toggleStatus(emp)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
                          isActive 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'}`} />
                        {isActive ? 'Authorized' : 'Suspended'}
                      </button>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleOpenModal(emp)}
                          className="p-3 bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-white hover:bg-brand-red rounded-xl transition-all border border-[var(--card-border)] shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="p-3 bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-[var(--card-border)] shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-[var(--card-border)]">
              <Search className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.3em] text-xs">Zero results detected in mainframe</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-brand-dark/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-slide-up border border-[var(--card-border)]">
            <div className="px-12 py-10 border-b border-[var(--card-border)] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
              <div>
                <h3 className="font-black text-3xl text-[var(--text-main)] tracking-tighter">{editingEmployee ? 'Record Calibration' : 'Initialize Unit'}</h3>
                <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.25em] mt-2">{editingEmployee ? 'Modifying master file archives' : 'Provisioning new operational identity'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-4 bg-black/5 dark:bg-white/5 hover:bg-brand-red group rounded-2xl transition-all border border-[var(--card-border)] shadow-sm">
                <X className="w-6 h-6 text-[var(--text-muted)] group-hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-12 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] ml-2">Identity Descriptor</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-red" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input w-full pl-16 pr-6 py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-tight"
                    placeholder="Full Designation Name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] ml-2">Division Sector</label>
                  <input
                    required
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="glass-input w-full px-6 py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-tight"
                    placeholder="Sector Code"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] ml-2">Rank Level</label>
                  <input
                    required
                    type="text"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="glass-input w-full px-6 py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-tight"
                    placeholder="Role ID"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] ml-2">Communication Frequency</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-red" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input w-full pl-16 pr-6 py-5 rounded-[1.5rem] text-sm font-black lowercase tracking-tight"
                    placeholder="corporate@mainframe.link"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] ml-2">Secure Link (Phone)</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-red" />
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="glass-input w-full pl-16 pr-6 py-5 rounded-[1.5rem] text-sm font-black"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
              <div className="pt-8 flex gap-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-5 bg-black/5 dark:bg-white/5 text-[var(--text-muted)] font-black rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest text-xs border border-[var(--card-border)]"
                >
                  Terminate
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-5 premium-gradient text-white font-black rounded-2xl shadow-2xl shadow-brand-red/20 transition-all active:scale-95 uppercase tracking-widest text-xs ring-1 ring-white/20"
                >
                  {editingEmployee ? 'Commit Archive' : 'Validate Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
