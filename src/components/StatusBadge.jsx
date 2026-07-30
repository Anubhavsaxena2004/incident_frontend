import React from 'react';

export default function StatusBadge({ type = 'priority', value = 'MEDIUM', showDot = true, size = 'md' }) {
  const getBadgeStyle = () => {
    const val = String(value).toUpperCase();
    
    if (type === 'priority') {
      switch (val) {
        case 'CRITICAL':
          return {
            bg: 'rgba(239, 68, 68, 0.16)',
            color: '#f87171',
            border: 'rgba(239, 68, 68, 0.35)',
            dot: '#ef4444',
            label: 'CRITICAL'
          };
        case 'HIGH':
          return {
            bg: 'rgba(245, 158, 11, 0.16)',
            color: '#fbbf24',
            border: 'rgba(245, 158, 11, 0.35)',
            dot: '#f59e0b',
            label: 'HIGH'
          };
        case 'MEDIUM':
          return {
            bg: 'rgba(59, 130, 246, 0.16)',
            color: '#60a5fa',
            border: 'rgba(59, 130, 246, 0.35)',
            dot: '#3b82f6',
            label: 'MEDIUM'
          };
        case 'LOW':
        default:
          return {
            bg: 'rgba(148, 163, 184, 0.16)',
            color: '#cbd5e1',
            border: 'rgba(148, 163, 184, 0.3)',
            dot: '#94a3b8',
            label: 'LOW'
          };
      }
    } else {
      // Status
      switch (val) {
        case 'REPORTED':
          return {
            bg: 'rgba(245, 158, 11, 0.16)',
            color: '#fbbf24',
            border: 'rgba(245, 158, 11, 0.35)',
            dot: '#f59e0b',
            label: 'REPORTED'
          };
        case 'ASSIGNED':
        case 'IN_PROGRESS':
          return {
            bg: 'rgba(139, 92, 246, 0.16)',
            color: '#c084fc',
            border: 'rgba(139, 92, 246, 0.35)',
            dot: '#8b5cf6',
            label: val === 'IN_PROGRESS' ? 'IN PROGRESS' : 'ASSIGNED'
          };
        case 'RESOLVED':
        case 'CLOSED':
          return {
            bg: 'rgba(16, 185, 129, 0.16)',
            color: '#34d399',
            border: 'rgba(16, 185, 129, 0.35)',
            dot: '#10b981',
            label: val
          };
        default:
          return {
            bg: 'rgba(148, 163, 184, 0.16)',
            color: '#cbd5e1',
            border: 'rgba(148, 163, 184, 0.3)',
            dot: '#94a3b8',
            label: val
          };
      }
    }
  };

  const style = getBadgeStyle();
  const padding = size === 'sm' ? '0.15rem 0.45rem' : '0.25rem 0.65rem';
  const fontSize = size === 'sm' ? '0.6875rem' : '0.75rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: padding,
        borderRadius: '9999px',
        fontSize: fontSize,
        fontWeight: 700,
        letterSpacing: '0.04em',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        boxShadow: `0 2px 8px ${style.bg}`,
        lineHeight: 1
      }}
    >
      {showDot && (
        <span
          className="live-dot"
          style={{ background: style.dot, width: size === 'sm' ? '6px' : '7px', height: size === 'sm' ? '6px' : '7px' }}
        />
      )}
      <span>{style.label}</span>
    </span>
  );
}
