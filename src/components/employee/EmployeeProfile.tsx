import { useAuth } from '../../context/AuthContext';
import { LogOut, Mail, Phone, Briefcase, Calendar, Building, Camera, Lock, Key, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

export default function EmployeeProfile() {
  const { employee, logout, updateProfile, resetPassword } = useAuth();
  const { showSuccess, showWarning } = useNotification();
  const [showResetModal, setShowResetModal] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  if (!employee) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result as string });
        showSuccess('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showWarning('Passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      showWarning('Password must be at least 6 characters');
      return;
    }
    resetPassword(passwords.new);
    setShowResetModal(false);
    setPasswords({ new: '', confirm: '' });
    showSuccess('Password has been reset successfully');
  };

  const fields = [
    { icon: Mail, label: 'Email', value: employee.email },
    { icon: Phone, label: 'Phone', value: employee.phone },
    { icon: Building, label: 'Department', value: employee.department },
    { icon: Briefcase, label: 'Designation', value: employee.designation },
    { icon: Calendar, label: 'Joined', value: new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
  ];

  const isBase64 = employee.avatar.startsWith('data:image');

  return (
    <div className="p-4 pb-24 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white text-center shadow-xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative inline-block">
          <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto text-4xl font-black border-2 border-white/30 overflow-hidden shadow-inner">
            {isBase64 ? (
              <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
            ) : (
              employee.avatar
            )}
          </div>
          <label className="absolute bottom-[-4px] right-[-4px] bg-white text-emerald-600 p-2.5 rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-all border border-emerald-100 active:scale-95">
            <Camera className="w-4 h-4" />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
        
        <h2 className="text-2xl font-bold mt-5 tracking-tight">{employee.name}</h2>
        <p className="text-emerald-100/90 text-sm font-semibold uppercase tracking-wider">{employee.designation}</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 divide-y divide-slate-50 overflow-hidden">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/50 transition-colors">
            <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
              <Icon className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
        
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full flex items-center gap-4 px-6 py-5 hover:bg-emerald-50/50 transition-colors text-left"
        >
          <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
            <Key className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em]">Security</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">Reset Account Password</p>
          </div>
        </button>
      </div>

      <button
        onClick={logout}
        className="w-full py-5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-[2rem] transition-all flex items-center justify-center gap-3 border border-red-100 shadow-sm active:scale-[0.98]"
      >
        <LogOut className="w-5 h-5" />
        Log Out from Portal
      </button>

      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Security Reset</h3>
              </div>
              <button onClick={() => setShowResetModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
