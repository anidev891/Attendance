import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Eye, EyeOff, LogIn, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import employeeBG from '../../assets/employeeLoginBG.png';

export default function EmployeeLoginPage() {
  const { loginEmployee } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }
    setLoading(true);
    setTimeout(() => {
      const success = loginEmployee(email, password);
      if (!success) setError('Invalid email or password');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="full-bg transition-transform duration-1000 hover:scale-105 z-0"
        style={{ backgroundImage: `url(${employeeBG})` }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-brand-dark/90 via-brand-dark/40 to-brand-red/20 backdrop-blur-[2px]" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20 shadow-2xl">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg uppercase italic">ATTENDANCE </h1>
          <p className="text-rose-100/60 font-black text-[10px] uppercase tracking-[0.3em] mt-1 drop-shadow">Employee Division</p>
        </div>

        <div className="bg-white/90 dark:bg-brand-dark/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">Access Portal</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Identity Verification Required</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Authentication ID</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="aarav@company.com"
                className="w-full px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red/50 transition-all font-black tracking-widest text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Security Code</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red/50 transition-all pr-14 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-red transition-colors p-1.5"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl px-5 py-3 text-brand-red text-[10px] font-black uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 premium-gradient text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 active:scale-[0.98] uppercase tracking-[0.25em] text-[10px] ring-1 ring-white/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Initialize
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-[9px] font-black text-slate-400 hover:text-brand-red transition-colors group uppercase tracking-[0.2em]"
            >
              <Shield className="w-4 h-4" />
              Administrative Overrun
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
