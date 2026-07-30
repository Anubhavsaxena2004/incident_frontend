import React from 'react';
import { Shield, AlertTriangle, LogIn, LogOut, User, PlusCircle, RefreshCw, ExternalLink, Activity } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAuth, onLogout, onOpenCreate, onRefresh, isLoading }) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, marginBottom: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            padding: '0.625rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                EMERGENCY RESPONSE
              </h1>
              <span className="badge badge-critical pulse-emergency" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                LIVE COMMAND
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Incident Reporting & Dispatch System Microservice
            </span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          <button 
            className="btn btn-outline btn-sm"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh All Data"
          >
            <RefreshCw size={15} className={isLoading ? 'spin-icon' : ''} />
            <span>Sync</span>
          </button>

          {/* Swagger / Redoc Quick Links */}
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

          {currentUser ? (
            <>
              <button 
                className="btn btn-primary"
                onClick={onOpenCreate}
              >
                <PlusCircle size={17} />
                <span>Report Incident</span>
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.375rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <User size={16} color="#60a5fa" />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f3f4f6' }}>
                    {currentUser.username || currentUser.first_name || 'Authenticated User'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#3b82f6', fontWeight: 700 }}>
                    {currentUser.role || 'USER'}
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
