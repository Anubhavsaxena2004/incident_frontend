import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="skeleton" style={{ width: '90px', height: '20px' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="skeleton" style={{ width: '60px', height: '20px' }} />
            <div className="skeleton" style={{ width: '70px', height: '20px' }} />
          </div>
        </div>
        <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: '0.75rem' }} />
        <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '0.4rem' }} />
        <div className="skeleton" style={{ width: '65%', height: '14px' }} />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div className="skeleton" style={{ width: '110px', height: '14px' }} />
          <div className="skeleton" style={{ width: '90px', height: '14px' }} />
        </div>
        <div className="skeleton" style={{ width: '100%', height: '32px' }} />
      </div>
    </div>
  );
}
