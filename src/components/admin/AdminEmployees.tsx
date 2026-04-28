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
    present: 'bg-emerald-100 text-emerald-700',
    absent: 'bg-slate-100 text-slate-500',
    leave: 'bg-amber-100 text-amber-700',
    wfh: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, dept, or email..."
            className="w-full pl-10 pr-4 py-3.5 bg-white border border-indigo-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => handleOpenModal()}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-indigo-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-50/30 border-b border-indigo-50">
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Employee Info</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Role & Dept</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Acct Status</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map(emp => {
                const attStatus = getAttendanceStatus(emp.id);
                const isActive = emp.status === 'active';
                return (
                  <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${!isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{emp.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <p className="text-xs text-slate-500">{emp.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm font-semibold text-slate-700">{emp.designation}</p>
                      <p className="text-xs text-slate-400">{emp.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${attendanceColors[attStatus]}`}>
                        {attStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(emp)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(emp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
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
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No employees found matching your search</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-xl text-slate-800">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{editingEmployee ? 'Update their corporate profile' : 'Set up a new team member'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-white/60 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Department</label>
                  <input
                    required
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/50 border border-white/60 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    placeholder="Engineering"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Designation</label>
                  <input
                    required
                    type="text"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/50 border border-white/60 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    placeholder="Developer"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-white/60 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    placeholder="aarav@company.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-white/60 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  {editingEmployee ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
