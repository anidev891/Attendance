import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Notification, { NotificationType } from '../components/shared/Notification';
import { X, AlertTriangle } from 'lucide-react';

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
  type: 'danger' | 'warning' | 'info';
}

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  showDanger: (message: string) => void;
  confirm: (options: { title: string; message: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
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

  const confirm = useCallback(({ title, message, onConfirm, type = 'warning' }: { title: string; message: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => {
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                confirmState.type === 'danger' ? 'bg-red-50 text-red-500' : 
                confirmState.type === 'warning' ? 'bg-amber-50 text-amber-500' : 
                'bg-blue-50 text-blue-500'
              }`}>
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{confirmState.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{confirmState.message}</p>
            </div>
            <div className="flex border-t border-slate-100">
              <button
                onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-6 py-4 text-sm font-bold text-slate-400 hover:bg-slate-50 transition-colors border-r border-slate-100"
              >
                No, Cancel
              </button>
              <button
                onClick={confirmState.onConfirm}
                className={`flex-1 px-6 py-4 text-sm font-bold transition-colors hover:opacity-90 ${
                  confirmState.type === 'danger' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 
                  confirmState.type === 'warning' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                  'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
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
