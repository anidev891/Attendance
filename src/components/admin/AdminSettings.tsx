import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Settings, MapPin, Clock, Save } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AdminSettings() {
  const { settings, updateSettings } = useAppData();
  const { showSuccess } = useNotification();
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
    showSuccess('System settings updated successfully');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-brand-red/20 ring-1 ring-white/20">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight uppercase italic leading-none">System Settings</h2>
            <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.3em] mt-1">Core Operational Protocols</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Geofencing Configuration */}
            <div className="glass-card rounded-[2rem] p-6 shadow-lg border border-[var(--card-border)] border-l-[8px] border-l-brand-red space-y-6">
              <div className="flex items-center gap-3 text-[var(--text-main)] font-black border-b border-[var(--card-border)] pb-4">
                <div className="p-2 bg-brand-red/10 rounded-xl">
                  <MapPin className="w-4 h-4 text-brand-red" />
                </div>
                <h3 className="text-xs uppercase tracking-widest">Geofencing</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={tempSettings.officeLocation.latitude}
                    onChange={e => setTempSettings({
                      ...tempSettings,
                      officeLocation: { ...tempSettings.officeLocation, latitude: parseFloat(e.target.value) }
                    })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red/50 transition-all text-[var(--text-main)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={tempSettings.officeLocation.longitude}
                    onChange={e => setTempSettings({
                      ...tempSettings,
                      officeLocation: { ...tempSettings.officeLocation, longitude: parseFloat(e.target.value) }
                    })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red/50 transition-all text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Radius (Meters)</label>
                <input
                  type="number"
                  value={tempSettings.officeLocation.radius}
                  onChange={e => setTempSettings({
                    ...tempSettings,
                    officeLocation: { ...tempSettings.officeLocation, radius: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red/50 transition-all text-[var(--text-main)]"
                />
              </div>
              <p className="text-[9px] text-[var(--text-muted)] font-black italic bg-brand-red/5 p-3 rounded-xl border border-brand-red/10 uppercase tracking-tight">
                * Check-in restricted to coordinates perimeter
              </p>
            </div>

            {/* Working Hours Configuration */}
            <div className="glass-card rounded-[2rem] p-6 shadow-lg border border-[var(--card-border)] border-l-[8px] border-l-rose-500 space-y-6">
              <div className="flex items-center gap-3 text-[var(--text-main)] font-black border-b border-[var(--card-border)] pb-4">
                <div className="p-2 bg-rose-500/10 rounded-xl">
                  <Clock className="w-4 h-4 text-rose-500" />
                </div>
                <h3 className="text-xs uppercase tracking-widest">Shift Hours</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Shift Start</label>
                  <input
                    type="time"
                    value={tempSettings.checkInTime}
                    onChange={e => setTempSettings({ ...tempSettings, checkInTime: e.target.value })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all text-[var(--text-main)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Shift End</label>
                  <input
                    type="time"
                    value={tempSettings.checkOutTime}
                    onChange={e => setTempSettings({ ...tempSettings, checkOutTime: e.target.value })}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all text-[var(--text-main)]"
                  />
                </div>
              </div>
              <p className="text-[9px] text-[var(--text-muted)] font-black italic bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 uppercase tracking-tight">
                * Latency protocols apply after shift start
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="flex items-center gap-3 premium-gradient text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-xl shadow-brand-red/20 active:scale-95 group ring-1 ring-white/20"
            >
              <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Commit Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
