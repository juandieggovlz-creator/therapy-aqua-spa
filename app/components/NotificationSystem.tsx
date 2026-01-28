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

export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-blue-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-[#3d2817]">Confirmar Acción</h3>
          </div>
        </div>
        <p class="text-stone-700 mb-6">${message}</p>
        <div class="flex gap-3">
          <button id="confirm-yes" class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold">
            Sí, Confirmar
          </button>
          <button id="confirm-no" class="flex-1 bg-stone-200 text-stone-700 px-6 py-3 rounded-lg hover:bg-stone-300 transition-all font-semibold">
            Cancelar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const cleanup = () => {
      document.body.removeChild(modal);
    };
    
    modal.querySelector('#confirm-yes')?.addEventListener('click', () => {
      cleanup();
      resolve(true);
    });
    
    modal.querySelector('#confirm-no')?.addEventListener('click', () => {
      cleanup();
      resolve(false);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cleanup();
        resolve(false);
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








