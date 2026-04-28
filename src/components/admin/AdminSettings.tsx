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
    <div className="min-h-full flex flex-col items-center justify-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-4 mb-2 justify-center sm:justify-start">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
            <p className="text-slate-500 text-sm font-medium">Configure organizational rules and geofencing</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Geofencing Configuration */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-100/50 border border-indigo-100 border-l-8 border-l-indigo-600 space-y-8">
              <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-50 pb-6">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg">Geofencing</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={tempSettings.officeLocation.latitude}
                    onChange={e => setTempSettings({
                      ...tempSettings,
                      officeLocation: { ...tempSettings.officeLocation, latitude: parseFloat(e.target.value) }
                    })}
                    className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={tempSettings.officeLocation.longitude}
                    onChange={e => setTempSettings({
                      ...tempSettings,
                      officeLocation: { ...tempSettings.officeLocation, longitude: parseFloat(e.target.value) }
                    })}
                    className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Allowed Radius (Meters)</label>
                <input
                  type="number"
                  value={tempSettings.officeLocation.radius}
                  onChange={e => setTempSettings({
                    ...tempSettings,
                    officeLocation: { ...tempSettings.officeLocation, radius: parseInt(e.target.value) }
                  })}
                  className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium italic bg-indigo-50/20 p-3 rounded-xl border border-indigo-50">
                * Employees can only check-in if they are within this radius from the coordinates.
              </p>
            </div>

            {/* Working Hours Configuration */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-100/50 border border-indigo-100 border-l-8 border-l-indigo-600 space-y-8">
              <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-50 pb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg">Working Hours</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Check-in Time</label>
                  <input
                    type="time"
                    value={tempSettings.checkInTime}
                    onChange={e => setTempSettings({ ...tempSettings, checkInTime: e.target.value })}
                    className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Check-out Time</label>
                  <input
                    type="time"
                    value={tempSettings.checkOutTime}
                    onChange={e => setTempSettings({ ...tempSettings, checkOutTime: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                * Attendance will be marked as 'Late' if check-in happens after this time.
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/30 active:scale-95 group"
            >
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
