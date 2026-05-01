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
  success: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
  error: 'bg-brand-red/10 border-brand-red/20 text-brand-red',
  info: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
};

const iconColors = {
  success: 'text-rose-500',
  error: 'text-brand-red',
  info: 'text-rose-500',
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
    <div className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl ${colors[type]} shadow-2xl animate-in slide-in-from-right-full duration-300 max-w-md w-full pointer-events-auto`}>
      <div className={`flex-shrink-0 p-2 rounded-xl bg-white/5 ${iconColors[type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest flex-grow">{message}</p>
      <button 
        onClick={() => onClose(id)}
        className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded-lg"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
