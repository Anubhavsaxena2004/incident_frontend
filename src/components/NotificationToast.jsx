import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const { type = 'success', message } = notification;

  const isSuccess = type === 'success';

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 200,
      background: isSuccess ? '#064e3b' : '#7f1d1d',
      border: `1px solid ${isSuccess ? '#10b981' : '#ef4444'}`,
      borderRadius: '10px',
      padding: '0.875rem 1.25rem',
      color: '#ffffff',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      maxWidth: '400px',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {isSuccess ? <CheckCircle2 size={20} color="#34d399" /> : <AlertTriangle size={20} color="#f87171" />}
      <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </div>
  );
}
