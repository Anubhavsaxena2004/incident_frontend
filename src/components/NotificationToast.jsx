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
      bottom: '1.75rem',
      right: '1.75rem',
      zIndex: 200,
      background: isSuccess ? 'rgba(6, 78, 59, 0.92)' : 'rgba(127, 29, 29, 0.92)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
      borderRadius: '12px',
      padding: '0.875rem 1.25rem',
      color: '#ffffff',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      maxWidth: '420px',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {isSuccess ? <CheckCircle2 size={20} color="#34d399" /> : <AlertTriangle size={20} color="#f87171" />}
      <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1, lineHeight: 1.4 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.2rem' }}>
        <X size={16} />
      </button>
    </div>
  );
}
