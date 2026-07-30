import React, { useState, useEffect } from 'react';
import { Activity, Server, ShieldCheck, Clock, Radio } from 'lucide-react';

export default function SystemHealthBar() {
  const [timeStr, setTimeStr] = useState('');
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Randomize slight latency fluctuation for live SOC feel (20-32ms)
    const latInterval = setInterval(() => {
      setLatency(Math.floor(20 + Math.random() * 12));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(latInterval);
    };
  }, []);

  return (
    <div style={{
      background: 'rgba(15, 21, 33, 0.9)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.4rem 1.5rem',
      fontSize: '0.75rem',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem'
    }}>
      {/* Left: System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 600 }}>
          <span className="live-dot" style={{ background: '#10b981' }} />
          <span>SOC SYSTEM OPERATIONAL</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b' }}>
          <ShieldCheck size={13} color="#60a5fa" />
          <span>Uptime: <strong style={{ color: '#cbd5e1' }}>99.98%</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b' }}>
          <Server size={13} color="#a855f7" />
          <span>API Node: <code style={{ color: '#cbd5e1', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>http://52.63.212.154</code></span>
          <span style={{ color: '#34d399', fontWeight: 600, marginLeft: '0.2rem' }}>({latency}ms)</span>
        </div>
      </div>

      {/* Right: Responders & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24' }}>
          <Radio size={13} />
          <span>DISPATCHERS ACTIVE: <strong>14 ON-DUTY</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f8fafc', fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
          <Clock size={13} color="#3b82f6" />
          <span>{timeStr || '00:00:00'} UTC+5:30</span>
        </div>
      </div>
    </div>
  );
}
