"use client";

import React, { useState, useEffect } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

let notificationId = 0;
const listeners: Array<(notifications: Notification[]) => void> = [];
let notifications: Notification[] = [];

const addNotification = (type: NotificationType, message: string, duration: number = 4000) => {
  const id = `notif-${++notificationId}`;
  const notification: Notification = { id, type, message, duration };
  notifications = [...notifications, notification];
  listeners.forEach(listener => listener(notifications));
  
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
  
  return id;
};

const removeNotification = (id: string) => {
  notifications = notifications.filter(n => n.id !== id);
  listeners.forEach(listener => listener(notifications));
};

export const showNotification = {
  success: (message: string, duration?: number) => addNotification('success', message, duration),
  error: (message: string, duration?: number) => addNotification('error', message, duration),
  warning: (message: string, duration?: number) => addNotification('warning', message, duration),
  info: (message: string, duration?: number) => addNotification('info', message, duration),
};

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const showConfirm = (options: ConfirmOptions | string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Si es un string, convertirlo a objeto
    const opts: ConfirmOptions = typeof options === 'string' 
      ? { message: options }
      : options;

    const title = opts.title || 'Confirmar Acción';
    const message = opts.message;
    const confirmText = opts.confirmText || 'Sí, Confirmar';
    const cancelText = opts.cancelText || 'Cancelar';
    const type = opts.type || 'warning';

    // Estilos según el tipo
    const iconConfig = {
      danger: {
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />`
      },
      warning: {
        bgColor: 'bg-amber-100',
        iconColor: 'text-amber-600',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />`
      },
      info: {
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />`
      }
    };

    const config = iconConfig[type];
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-scaleIn">
        <div class="flex items-start gap-4 mb-6">
          <div class="w-14 h-14 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7 ${config.iconColor}">
              ${config.icon}
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-2">${title}</h3>
            <p class="text-gray-700 leading-relaxed">${message}</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button id="confirm-no" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3.5 rounded-xl transition-all font-bold text-base">
            ${cancelText}
          </button>
          <button id="confirm-yes" class="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3.5 rounded-xl hover:shadow-xl transition-all font-bold text-base">
            ${confirmText}
          </button>
        </div>
      </div>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      </style>
    `;
    
    document.body.appendChild(modal);
    
    const cleanup = () => {
      modal.style.opacity = '0';
      modal.querySelector('div')!.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 200);
    };
    
    modal.querySelector('#confirm-yes')?.addEventListener('click', () => {
      cleanup();
      setTimeout(() => resolve(true), 200);
    });
    
    modal.querySelector('#confirm-no')?.addEventListener('click', () => {
      cleanup();
      setTimeout(() => resolve(false), 200);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cleanup();
        setTimeout(() => resolve(false), 200);
      }
    });
  });
};

export default function NotificationSystem() {
  const [currentNotifications, setCurrentNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const listener = (notifs: Notification[]) => {
      setCurrentNotifications(notifs);
    };
    listeners.push(listener);
    setCurrentNotifications(notifications);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-300 text-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-300 text-blue-800';
      default:
        return 'bg-stone-50 border-stone-300 text-stone-800';
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9998] space-y-2">
      {currentNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-6 py-4 rounded-lg shadow-lg border-2 animate-fade-in ${getNotificationStyles(notification.type)}`}
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
            <p className="font-semibold text-sm flex-1">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Cerrar notificación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}








