import React from 'react';

export default function MetricCard({ title, value, icon: IconComponent, color, bgGlow, borderColor, subtext, sparklineData = [] }) {
  // Generate simple smooth SVG sparkline path from array of numbers
  const generateSparklinePath = (data) => {
    if (!data || data.length < 2) return 'M 0,20 L 100,20';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 120;
    const height = 32;

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const sparklinePath = generateSparklinePath(sparklineData);

  return (
    <div
      className="glass-panel glass-panel-hover"
      style={{
        padding: '1.25rem 1.5rem',
        borderColor: borderColor || 'rgba(255, 255, 255, 0.1)',
        background: `linear-gradient(145deg, rgba(22, 28, 42, 0.85) 0%, ${bgGlow || 'rgba(59, 130, 246, 0.08)'} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {title}
          </span>
          <div style={{
            background: bgGlow || 'rgba(255, 255, 255, 0.06)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${borderColor || 'rgba(255, 255, 255, 0.1)'}`
          }}>
            <IconComponent size={20} color={color} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="brand-font" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
            {value}
          </div>

          {/* SVG Sparkline */}
          <div style={{ width: '100px', height: '32px', opacity: 0.85 }}>
            <svg width="100%" height="100%" viewBox="0 0 120 32" style={{ overflow: 'visible' }}>
              <path
                d={sparklinePath}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`${sparklinePath} L 120,32 L 0,32 Z`}
                fill={color}
                fillOpacity="0.15"
              />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block' }} />
        <span>{subtext}</span>
      </div>
    </div>
  );
}
