import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { MapPin, Clock, CheckCircle, LogOut, AlertCircle, Laptop } from 'lucide-react';

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

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
        <p className="text-emerald-100 text-sm">{dateStr}</p>
        <p className="text-3xl font-bold mt-1 tabular-nums">{timeStr}</p>
        <div className="mt-3 flex items-center gap-2">
          {isWfhApproved ? (
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Laptop className="w-3 h-3" /> WFH Today
            </span>
          ) : isCheckedOut ? (
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Checked Out
            </span>
          ) : isCheckedIn ? (
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 animate-pulse" /> Checked In
            </span>
          ) : (
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
              Not Checked In
            </span>
          )}
        </div>
      </div>

      {todayRecord && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-800 text-sm">Today's Attendance</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-emerald-600 font-medium">Check In</p>
              <p className="text-lg font-bold text-emerald-700">{todayRecord.checkIn || '--:--'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 font-medium">Check Out</p>
              <p className="text-lg font-bold text-slate-700">{todayRecord.checkOut || '--:--'}</p>
            </div>
          </div>
        </div>
      )}

      {locationError && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{locationError}</p>
        </div>
      )}

      <div className="space-y-3">
        {!isCheckedIn && (
          <button
            onClick={handleCheckIn}
            disabled={locationStatus === 'fetching'}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {locationStatus === 'fetching' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Check In
              </>
            )}
          </button>
        )}

        {isCheckedIn && !isCheckedOut && (
          <button
            onClick={handleCheckOut}
            disabled={locationStatus === 'fetching'}
            className="w-full py-4 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {locationStatus === 'fetching' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                Check Out
              </>
            )}
          </button>
        )}

        {isCheckedOut && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-emerald-700 font-medium">You have checked out for today</p>
            <p className="text-emerald-600 text-sm mt-1">
              {todayRecord.checkIn} - {todayRecord.checkOut}
            </p>
          </div>
        )}
      </div>

      {isWfhApproved && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
          <Laptop className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-blue-700 font-medium text-sm">WFH Approved</p>
            <p className="text-blue-600 text-xs">Location restriction is disabled for today</p>
          </div>
        </div>
      )}
    </div>
  );
}
