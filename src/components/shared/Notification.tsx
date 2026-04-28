import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
};

const iconColors = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
};

export default function Notification({ id, type, message, onClose }: NotificationProps) {
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${colors[type]} shadow-lg animate-in slide-in-from-right-full duration-300 max-w-md w-full pointer-events-auto`}>
      <div className={`flex-shrink-0 ${iconColors[type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium flex-grow">{message}</p>
      <button 
        onClick={() => onClose(id)}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
