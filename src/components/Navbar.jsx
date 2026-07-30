import React from 'react';
import { Shield, LogIn, LogOut, User, PlusCircle, RefreshCw, ExternalLink, Activity, Search } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAuth, onLogout, onOpenCreate, onRefresh, isLoading, onFocusSearch }) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, marginBottom: '1.5rem', background: 'rgba(22, 28, 44, 0.85)' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & System Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            padding: '0.625rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(239, 68, 68, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Shield size={26} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h1 style={{ fontSize: '1.35rem', color: '#ffffff', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                COMMAND CENTER
              </h1>
              <span className="badge pulse-emergency" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                SOC LIVE
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
              Enterprise Incident Dispatch & Telemetry Service
            </span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Quick Search Shortcut Hint */}
          <button 
            className="btn btn-outline btn-sm"
            onClick={onFocusSearch}
            title="Focus search input (Shortcut: /)"
            style={{ color: '#94a3b8' }}
          >
            <Search size={14} />
            <span>Search</span>
            <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.6875rem', color: '#cbd5e1' }}>/</kbd>
          </button>

          {/* Sync Button */}
          <button 
            className="btn btn-outline btn-sm"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh All Telemetry Data"
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
            <span>Sync</span>
          </button>

          {/* Swagger API Quick Link */}
          <a
            href="http://52.63.212.154/api/schema/swagger-ui/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={14} />
            <span>Swagger API</span>
          </a>

          {/* Authentication & User Badge */}
          {currentUser ? (
            <>
              <button 
                className="btn btn-primary"
                onClick={onOpenCreate}
                style={{ padding: '0.5rem 1rem' }}
              >
                <PlusCircle size={17} />
                <span>Log New Incident</span>
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.35rem', borderRadius: '6px' }}>
                  <User size={15} color="#60a5fa" />
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
                    {currentUser.username || currentUser.first_name || 'Authenticated User'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {currentUser.role || 'CITIZEN'}
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-outline btn-sm"
                onClick={onLogout}
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={onOpenAuth}
            >
              <LogIn size={16} />
              <span>Login / Register</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
