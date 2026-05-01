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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} 
          />
          <div className="glass-card rounded-[2.5rem] shadow-2xl w-full max-w-[400px] overflow-hidden animate-slide-up relative z-10 border border-[var(--card-border)] bg-[var(--card-bg)]">
            <div className="p-10 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative shadow-2xl ring-1 ring-white/20 ${
                confirmState.type === 'danger' ? 'bg-brand-red text-white shadow-brand-red/20' : 
                confirmState.type === 'success' ? 'bg-brand-red text-white shadow-brand-red/20' :
                confirmState.type === 'warning' ? 'bg-amber-500 text-white shadow-amber-500/20' : 
                'bg-brand-red text-white shadow-brand-red/20'
              }`}>
                {confirmState.type === 'danger' && <AlertCircle className="w-8 h-8" />}
                {confirmState.type === 'success' && <CheckCircle2 className="w-8 h-8" />}
                {confirmState.type === 'warning' && <AlertTriangle className="w-8 h-8" />}
                {confirmState.type === 'info' && <Info className="w-8 h-8" />}
                
                {/* Decorative pulse */}
                <div className="absolute inset-0 rounded-2xl animate-ping opacity-10 bg-current" />
              </div>
              
              <h3 className="text-xl font-black text-[var(--text-main)] mb-2 tracking-tight uppercase italic">{confirmState.title}</h3>
              <p className="text-[var(--text-muted)] text-[10px] leading-relaxed font-black uppercase tracking-widest">{confirmState.message}</p>
            </div>
            
            <div className="flex gap-3 p-8 pt-0">
              <button
                onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-4 py-4 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-main)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-all active:scale-95 uppercase tracking-[0.2em] border border-[var(--card-border)]"
              >
                Abort
              </button>
              <button
                onClick={confirmState.onConfirm}
                className={`flex-1 px-4 py-4 text-[10px] font-black rounded-xl transition-all active:scale-95 shadow-xl uppercase tracking-[0.2em] ring-1 ring-white/20 text-white ${
                  confirmState.type === 'danger' ? 'bg-brand-red shadow-brand-red/40 hover:scale-105' : 
                  confirmState.type === 'success' ? 'bg-brand-red shadow-brand-red/40 hover:scale-105' :
                  confirmState.type === 'warning' ? 'bg-amber-500 shadow-amber-500/40 hover:scale-105' : 
                  'bg-brand-red shadow-brand-red/40 hover:scale-105'
                }`}
              >
                Execute
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
