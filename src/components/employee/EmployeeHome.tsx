import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { MapPin, Clock, CheckCircle, LogOut, AlertCircle, Laptop, Play, Timer } from 'lucide-react';

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function EmployeeHome() {
  const { employee, locationBoundary } = useAuth();
  const { attendance, addAttendance, updateAttendance, wfhRequests } = useAppData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
  const [locationError, setLocationError] = useState('');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(r => r.employeeId === employee?.id && r.date === today);
  const isCheckedIn = !!todayRecord?.checkIn;
  const isCheckedOut = !!todayRecord?.checkOut;

  const approvedWfh = wfhRequests.find(
    r => r.employeeId === employee?.id && r.date === today && r.status === 'approved'
  );
  const isWfhApproved = !!approvedWfh;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getShiftDuration = () => {
    if (!isCheckedIn || !todayRecord?.checkIn) return null;

    const [h, m] = todayRecord.checkIn.split(':').map(Number);
    const checkInTime = new Date();
    checkInTime.setHours(h, m, 0, 0);

    const endTime = isCheckedOut && todayRecord.checkOut
      ? (() => {
        const [eh, em] = todayRecord.checkOut.split(':').map(Number);
        const d = new Date();
        d.setHours(eh, em, 0, 0);
        return d;
      })()
      : currentTime;

    const diff = endTime.getTime() - checkInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleCheckIn = async () => {
    setLocationStatus('fetching');
    setLocationError('');
    try {
      const coords = await getCurrentLocation();
      setCurrentCoords(coords);

      if (!isWfhApproved) {
        const dist = getDistanceKm(coords.lat, coords.lon, locationBoundary.latitude, locationBoundary.longitude);
        if (dist > locationBoundary.radius) {
          setLocationStatus('error');
          setLocationError(`You are ${Math.round(dist)}m away from office. Must be within ${locationBoundary.radius}m.`);
          return;
        }
      }

      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const record = {
        id: `att-${Date.now()}`,
        employeeId: employee!.id,
        date: today,
        checkIn: time,
        checkOut: null,
        latitude: coords.lat,
        longitude: coords.lon,
        status: isWfhApproved ? 'wfh' as const : 'present' as const,
      };
      addAttendance(record);
      setLocationStatus('success');
    } catch {
      setLocationStatus('error');
      setLocationError('Could not get location. Please enable GPS.');
    }
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    setLocationStatus('fetching');
    try {
      const coords = await getCurrentLocation();
      setCurrentCoords(coords);
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      updateAttendance(todayRecord.id, { checkOut: time });
      setLocationStatus('success');
    } catch {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      updateAttendance(todayRecord.id, { checkOut: time });
      setLocationStatus('success');
    }
  };

  const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const shiftDuration = getShiftDuration();
  const timeDisplay = shiftDuration || currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Calculate Monthly Stats
  const employeeAttendance = attendance.filter(a => a.employeeId === employee?.id);
  const presentDays = employeeAttendance.filter(a => a.status === 'present' || a.status === 'wfh').length;
  const absentDays = employeeAttendance.filter(a => a.status === 'absent').length;
  const lateDays = employeeAttendance.filter(a => {
    if (!a.checkIn) return false;
    const [h, m] = a.checkIn.split(':').map(Number);
    return h > 9 || (h === 9 && m > 30);
  }).length;

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      {/* Hero Clock Card - Minimal Version */}
      <div className="glass-card rounded-[2rem] p-6 text-[var(--text-main)] relative overflow-hidden border-l-[8px] border-l-brand-red shadow-xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          {isCheckedIn ? <Timer className="w-16 h-16 text-brand-red" /> : <Clock className="w-16 h-16 text-[var(--text-main)]" />}
        </div>
        <div className="relative z-10">
          <p className="text-[var(--text-muted)] text-[8px] font-black uppercase tracking-[0.2em] mb-2">
            {isCheckedIn ? 'Session Active' : dateStr}
          </p>
          <p className={`text-4xl font-black tabular-nums tracking-tighter ${isCheckedIn ? 'text-brand-red' : 'text-gradient'}`}>
            {timeDisplay}
          </p>
          <div className="mt-6 flex items-center gap-2">
            {isWfhApproved ? (
              <span className="bg-brand-red/10 border border-brand-red/20 text-brand-red px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1 h-1 bg-brand-red rounded-full animate-pulse" />
                WFH Active
              </span>
            ) : isCheckedOut ? (
              <span className="bg-slate-500/10 border border-slate-500/20 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle className="w-2.5 h-2.5" /> Concluded
              </span>
            ) : isCheckedIn ? (
              <span className="bg-brand-red/20 border border-brand-red/30 text-brand-red px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-brand-red/20">
                <Play className="w-2.5 h-2.5 animate-pulse" /> Tracking
              </span>
            ) : (
              <span className="bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-[var(--text-muted)] px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest">
                Standby
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats - Compact */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Present', value: presentDays, icon: CheckCircle, active: isCheckedIn },
          { label: 'Absent', value: absentDays, icon: AlertCircle, color: 'text-rose-500' },
          { label: 'Late', value: lateDays, icon: Clock, color: 'text-amber-500' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-1 border-[var(--card-border)] hover:border-brand-red/30 transition-all shadow-sm">
              <div className={`p-2 rounded-lg bg-black/5 dark:bg-white/5 ${stat.color || 'text-[var(--text-muted)]'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">{stat.label}</p>
              <p className="text-xl font-black text-[var(--text-main)] tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Session Log - Minimal */}
      {todayRecord && (
        <div className="glass-card rounded-[2rem] p-6 space-y-4 border-l-[6px] border-l-brand-red shadow-md">
          <h3 className="text-[9px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-1 bg-brand-red rounded-full shadow-[0_0_8px_#e11d48]" />
            Telemetry
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-[var(--card-border)]">
              <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">Check-In</p>
              <p className="text-lg font-black text-[var(--text-main)] tabular-nums">{todayRecord.checkIn || '--:--'}</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-[var(--card-border)]">
              <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">Check-Out</p>
              <p className="text-lg font-black text-[var(--text-main)] tabular-nums">{todayRecord.checkOut || '--:--'}</p>
            </div>
          </div>
        </div>
      )}

      {locationError && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />
          <div>
            <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-0.5">Violation</p>
            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-tighter leading-tight">{locationError}</p>
          </div>
        </div>
      )}

      {/* Actions - Minimalized */}
      <div className="space-y-3 pt-2">
        {!isCheckedIn && (
          <button
            onClick={handleCheckIn}
            disabled={locationStatus === 'fetching'}
            className="w-full py-4 premium-gradient disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.25rem] transition-all shadow-lg shadow-brand-red/20 active:scale-[0.98] ring-1 ring-white/10 flex items-center justify-center gap-2"
          >
            {locationStatus === 'fetching' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Check-in
              </>
            )}
          </button>
        )}

        {isCheckedIn && !isCheckedOut && (
          <button
            onClick={handleCheckOut}
            disabled={locationStatus === 'fetching'}
            className="w-full py-4 bg-[var(--card-bg)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-main)] font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.25rem] transition-all border border-[var(--card-border)] flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {locationStatus === 'fetching' ? (
              <div className="w-4 h-4 border-2 border-[var(--text-main)]/30 border-t-[var(--text-main)] rounded-full animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Check-out
              </>
            )}
          </button>
        )}

        {isCheckedOut && (
          <div className="glass-card border-brand-red/30 rounded-[2rem] p-6 text-center shadow-md">
            <div className="w-10 h-10 bg-brand-red/10 text-brand-red rounded-xl flex items-center justify-center mx-auto mb-4 border border-brand-red/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-[var(--text-main)] font-black uppercase tracking-[0.2em] text-[10px]">Session Complete</p>
            <p className="text-[var(--text-muted)] text-[8px] font-black mt-2 uppercase tracking-widest border-t border-[var(--card-border)] pt-3 inline-block">
              {todayRecord.checkIn} — {todayRecord.checkOut}
            </p>
          </div>
        )}
      </div>

      {isWfhApproved && (
        <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-brand-red/20 rounded-xl">
            <Laptop className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <p className="text-[var(--text-main)] font-black text-[10px] uppercase tracking-tight">WFH Protocol Active</p>
            <p className="text-[var(--text-muted)] text-[8px] font-black uppercase tracking-[0.15em] mt-0.5">Fencing Bypass Enabled</p>
          </div>
        </div>
      )}
    </div>
  );
}
