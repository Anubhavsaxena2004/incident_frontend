import React from 'react';
import MetricCard from './MetricCard';
import { Activity, Clock, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

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
      bgGlow: 'rgba(59, 130, 246, 0.14)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      subtext: 'Logged in incident database',
      sparklineData: [4, 8, 5, 12, 9, 15, total || 12]
    },
    {
      title: 'PENDING / REPORTED',
      value: reported,
      icon: Clock,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.14)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      subtext: 'Awaiting operator dispatch',
      sparklineData: [2, 4, 3, 6, reported || 3, 5, reported || 2]
    },
    {
      title: 'ACTIVE RESPONSE',
      value: active,
      icon: ShieldAlert,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.14)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      subtext: 'Assigned & active in field',
      sparklineData: [1, 3, 4, active || 5, 6, 4, active || 4]
    },
    {
      title: 'CRITICAL / HIGH',
      value: critical,
      icon: AlertOctagon,
      color: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.14)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      subtext: 'Urgent priority alerts',
      sparklineData: [0, 2, 1, 4, 2, critical || 3, critical || 1]
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {stats.map((stat, idx) => (
        <MetricCard key={idx} {...stat} />
      ))}
    </div>
  );
}
