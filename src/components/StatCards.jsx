import React from 'react';
import { AlertOctagon, Activity, CheckCircle2, Clock } from 'lucide-react';

export default function StatCards({ incidents = [] }) {
  const total = incidents.length;
  const reported = incidents.filter(i => i.status === 'REPORTED').length;
  const active = incidents.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const critical = incidents.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length;

  const stats = [
    {
      title: 'TOTAL INCIDENTS',
      value: total,
      icon: Activity,
      color: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.12)',
      borderColor: 'rgba(59, 130, 246, 0.25)',
      subtext: 'Logged in system'
    },
    {
      title: 'PENDING / REPORTED',
      value: reported,
      icon: Clock,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      subtext: 'Awaiting operator review'
    },
    {
      title: 'ACTIVE RESPONSE',
      value: active,
      icon: Activity,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.12)',
      borderColor: 'rgba(139, 92, 246, 0.25)',
      subtext: 'Assigned or In-Progress'
    },
    {
      title: 'HIGH / CRITICAL',
      value: critical,
      icon: AlertOctagon,
      color: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.12)',
      borderColor: 'rgba(239, 68, 68, 0.25)',
      subtext: 'Urgent priority dispatch'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '1.25rem 1.5rem',
              borderColor: stat.borderColor,
              background: `linear-gradient(145deg, rgba(18, 26, 43, 0.85) 0%, ${stat.bgGlow} 100%)`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em' }}>
                {stat.title}
              </span>
              <div style={{
                background: stat.bgGlow,
                padding: '0.5rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={20} color={stat.color} />
              </div>
            </div>

            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
              {stat.value}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.35rem' }}>
              {stat.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
