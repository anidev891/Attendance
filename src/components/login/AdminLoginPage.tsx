import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, LogIn, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminBG from '../../assets/adminLoginBG.png';

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Username is required'); return; }
    if (!password) { setError('Password is required'); return; }
    setLoading(true);
    setTimeout(() => {
      const success = loginAdmin(username, password);
      if (!success) setError('Invalid username or password');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${adminBG})` }}
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-tr from-blue-900/60 via-transparent to-slate-900/60 backdrop-blur-[2px]" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-top-8 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mb-4 border border-white/20 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">AttendX</h1>
          <p className="text-blue-50 font-medium mt-1 drop-shadow">Administration Panel</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Admin Access</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to the administration panel</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
            >
              <User className="w-4 h-4" />
              Switch to Employee Login
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
