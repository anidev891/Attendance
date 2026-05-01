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
    <div className="p-4 pb-20 space-y-6 animate-slide-up">
      <div className="bg-gradient-to-br from-brand-red to-rose-700 rounded-[2rem] p-8 text-white text-center shadow-xl shadow-brand-red/20 relative overflow-hidden ring-1 ring-white/10">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-white rounded-full blur-2xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-white rounded-full blur-2xl" />
        </div>

        <div className="relative inline-block">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto text-3xl font-black border-2 border-white/30 overflow-hidden shadow-xl">
            {isBase64 ? (
              <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
            ) : (
              employee.avatar
            )}
          </div>
          <label className="absolute bottom-[-2px] right-[-2px] bg-white text-brand-red p-2.5 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-all border border-rose-100 active:scale-95">
            <Camera className="w-3.5 h-3.5" />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
        
        <h2 className="text-xl font-black mt-4 tracking-tight uppercase">{employee.name}</h2>
        <p className="text-emerald-50/80 text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 bg-black/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
           {employee.designation}
        </p>
      </div>

      <div className="glass-card rounded-[2rem] shadow-lg border border-[var(--card-border)] overflow-hidden">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 px-6 py-5 hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors group border-b border-[var(--card-border)] last:border-0">
            <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center border border-[var(--card-border)] shadow-sm group-hover:border-brand-red/30 transition-all">
              <Icon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-brand-red transition-colors" />
            </div>
            <div>
              <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em]">{label}</p>
              <p className="text-xs font-black text-[var(--text-main)] mt-0.5 uppercase tracking-tight">{value}</p>
            </div>
          </div>
        ))}
        
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full flex items-center gap-4 px-6 py-5 hover:bg-brand-red/5 transition-colors text-left group"
        >
          <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center border border-brand-red/20 shadow-sm group-hover:scale-105 transition-all">
            <Key className="w-4 h-4 text-brand-red" />
          </div>
          <div>
            <p className="text-[8px] font-black text-brand-red uppercase tracking-[0.1em]">Security</p>
            <p className="text-xs font-black text-[var(--text-main)] mt-0.5 uppercase tracking-tight">Change Password</p>
          </div>
        </button>
      </div>

      <button
        onClick={logout}
        className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 font-black rounded-2xl transition-all flex items-center justify-center gap-2 border border-rose-500/20 shadow-sm active:scale-[0.98] uppercase tracking-[0.15em] text-[10px]"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>

      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-brand-dark/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
          <div className="glass-card rounded-[3.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up border border-[var(--card-border)]">
            <div className="px-10 py-8 border-b border-[var(--card-border)] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-red/10 rounded-2xl flex items-center justify-center border border-brand-red/20">
                  <ShieldCheck className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                   <h3 className="font-black text-lg text-[var(--text-main)] uppercase tracking-tight">Security Reset</h3>
                   <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Calibration required</p>
                </div>
              </div>
              <button onClick={() => setShowResetModal(false)} className="p-3 bg-black/5 dark:bg-white/5 hover:bg-brand-red group rounded-xl transition-all border border-[var(--card-border)] shadow-sm">
                <X className="w-5 h-5 text-[var(--text-muted)] group-hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-10 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] ml-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red" />
                  <input
                    required
                    type="password"
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    className="glass-input w-full pl-14 pr-4 py-5 rounded-2xl text-sm font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] ml-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red" />
                  <input
                    required
                    type="password"
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="glass-input w-full pl-14 pr-4 py-5 rounded-2xl text-sm font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-4 bg-black/5 dark:bg-white/5 text-[var(--text-muted)] font-black rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest text-[10px] border border-[var(--card-border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 premium-gradient text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-red/20 active:scale-95 uppercase tracking-widest text-[10px] ring-1 ring-white/20"
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
