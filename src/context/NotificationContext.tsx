import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Notification, { NotificationType } from '../components/shared/Notification';
import { X, AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  type: 'danger' | 'warning' | 'info' | 'success';
}

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  showDanger: (message: string) => void;
  confirm: (options: { title: string; message: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' | 'success' }) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
  }, []);

  const showSuccess = (message: string) => addNotification('success', message);
  const showError = (message: string) => addNotification('error', message);
  const showInfo = (message: string) => addNotification('info', message);
  const showWarning = (message: string) => addNotification('warning', message);
  const showDanger = (message: string) => addNotification('error', message); // Mapping danger to error style

  const confirm = useCallback(({ title, message, onConfirm, type = 'warning' }: { title: string; message: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' | 'success' }) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      },
      type
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo, showWarning, showDanger, confirm }}>
      {children}
      
      {/* Notifications Toast List */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none items-end">
        {notifications.map(n => (
          <Notification 
            key={n.id}
            id={n.id}
            type={n.type}
            message={n.message}
            onClose={removeNotification}
          />
        ))}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} 
          />
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-[380px] overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative z-10 border border-white">
            <div className="p-10 text-center">
              <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 relative animate-bounce shadow-2xl ${
                confirmState.type === 'danger' ? 'bg-red-500 text-white shadow-red-200' : 
                confirmState.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                confirmState.type === 'warning' ? 'bg-amber-500 text-white shadow-amber-200' : 
                'bg-blue-500 text-white shadow-blue-200'
              }`}>
                {confirmState.type === 'danger' && <AlertCircle className="w-10 h-10" />}
                {confirmState.type === 'success' && <CheckCircle2 className="w-10 h-10" />}
                {confirmState.type === 'warning' && <AlertTriangle className="w-10 h-10" />}
                {confirmState.type === 'info' && <Info className="w-10 h-10" />}
                
                {/* Decorative pulse */}
                <div className="absolute inset-0 rounded-[1.75rem] animate-ping opacity-20 bg-current" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{confirmState.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium">{confirmState.message}</p>
            </div>
            
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-6 py-4 text-sm font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all active:scale-95"
              >
                No, Cancel
              </button>
              <button
                onClick={confirmState.onConfirm}
                className={`flex-1 px-6 py-4 text-sm font-black rounded-2xl transition-all active:scale-95 shadow-lg ${
                  confirmState.type === 'danger' ? 'bg-red-500 text-white shadow-red-500/25 hover:bg-red-600' : 
                  confirmState.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/25 hover:bg-emerald-600' :
                  confirmState.type === 'warning' ? 'bg-amber-500 text-white shadow-amber-500/25 hover:bg-amber-600' : 
                  'bg-blue-500 text-white shadow-blue-500/25 hover:bg-blue-600'
                }`}
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
