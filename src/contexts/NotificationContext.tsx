import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '../components/ui/Toast';

interface NotificationContextType {
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration: number = 4000
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastData = { id, type, message, duration };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, duration?: number) => {
    showNotification('success', message, duration);
  };

  const showError = (message: string, duration?: number) => {
    showNotification('error', message, duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showNotification('warning', message, duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showNotification('info', message, duration);
  };

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Renderizar toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
          duration={toast.duration}
          position="top-right"
        />
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  return context;
}
