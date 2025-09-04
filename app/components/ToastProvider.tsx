"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Icon from './Icon';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'fun';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  showFunToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2);
    const toast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const showFunToast = useCallback((message: string) => {
    showToast(message, 'fun', 5000);
  }, [showToast]);

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      case 'fun':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-2xl';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'celebration';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'fun':
        return 'gamepad';
      default:
        return 'lightbulb';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showFunToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              ${getToastStyles(toast.type)}
              px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 
              animate-in slide-in-from-right-full pointer-events-auto max-w-sm
              ${toast.type === 'fun' ? 'animate-bounce' : ''}
            `}
            onClick={() => removeToast(toast.id)}
          >
            <div className="flex items-center gap-3">
              <Icon name={getIcon(toast.type) as any} className="flex-shrink-0" size="md" />
              <p className="font-medium text-sm">{toast.message}</p>
              <button 
                onClick={() => removeToast(toast.id)}
                className="ml-auto text-white/70 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}