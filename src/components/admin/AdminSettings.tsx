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
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-emerald-100 rounded-xl">
          <Settings className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500 text-sm">Configure organizational rules and geofencing</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Geofencing Configuration */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-50 pb-4">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <h3>Geofencing Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Office Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={tempSettings.officeLocation.latitude}
                  onChange={e => setTempSettings({
                    ...tempSettings,
                    officeLocation: { ...tempSettings.officeLocation, latitude: parseFloat(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Office Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={tempSettings.officeLocation.longitude}
                  onChange={e => setTempSettings({
                    ...tempSettings,
                    officeLocation: { ...tempSettings.officeLocation, longitude: parseFloat(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Allowed Radius (Meters)</label>
              <input
                type="number"
                value={tempSettings.officeLocation.radius}
                onChange={e => setTempSettings({
                  ...tempSettings,
                  officeLocation: { ...tempSettings.officeLocation, radius: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * Employees can only check-in if they are within this radius from the coordinates.
            </p>
          </div>

          {/* Working Hours Configuration */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-50 pb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3>Working Hours</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Standard Check-in Time</label>
                <input
                  type="time"
                  value={tempSettings.checkInTime}
                  onChange={e => setTempSettings({ ...tempSettings, checkInTime: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Standard Check-out Time</label>
                <input
                  type="time"
                  value={tempSettings.checkOutTime}
                  onChange={e => setTempSettings({ ...tempSettings, checkOutTime: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * Attendance will be marked as 'Late' if check-in happens after this time.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Save className="w-5 h-5" />
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
