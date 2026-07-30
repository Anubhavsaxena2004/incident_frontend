import React, { useState, useEffect, useRef } from 'react';
import SystemHealthBar from './components/SystemHealthBar';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import IncidentFilter from './components/IncidentFilter';
import IncidentCard from './components/IncidentCard';
import SkeletonCard from './components/SkeletonCard';
import AuthModal from './components/AuthModal';
import CreateIncidentModal from './components/CreateIncidentModal';
import IncidentDetailModal from './components/IncidentDetailModal';
import NotificationToast from './components/NotificationToast';
import { getIncidents, getCurrentUser, deleteIncident, logoutUser } from './api/client';
import { ShieldAlert, AlertCircle, PlusCircle, RefreshCw, LayoutGrid, List, LogIn, Lock } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Layout View Mode: 'grid' | 'list'
  const [viewMode, setViewMode] = useState('grid');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Notification Toast state
  const [notification, setNotification] = useState(null);

  // Search input ref for keyboard shortcut focus
  const searchInputRef = useRef(null);

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    search: '',
  });

  // Load initial session on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_info');
    
    if (token && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
      fetchCurrentUser();
      fetchIncidents();
    } else {
      // Clear any stale local data
      localStorage.removeItem('user_info');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setCurrentUser(null);
      setIncidents([]);
      setLoading(false);
    }

    // Auto logout handler
    const handleAutoLogout = () => {
      setCurrentUser(null);
      setIncidents([]);
      localStorage.removeItem('user_info');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      showNotification('error', 'Session expired. Please log in again.');
    };
    window.addEventListener('auth:logout', handleAutoLogout);

    // Global keyboard shortcut ('/' to focus search)
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('auth:logout', handleAutoLogout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Refetch when filters change if logged in
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      fetchIncidents();
    }
  }, [filters]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      localStorage.setItem('user_info', JSON.stringify(user));
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        setCurrentUser(null);
        setIncidents([]);
      }
    }
  };

  const fetchIncidents = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIncidents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getIncidents(filters);
      const list = Array.isArray(data) ? data : (data.results || []);
      setIncidents(list);
    } catch (err) {
      console.error('Failed to load incidents:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        setCurrentUser(null);
        setIncidents([]);
      } else {
        setError('Could not connect to incident backend service. Please check connection or CORS config.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setIncidents([]);
    showNotification('success', 'Logged out successfully');
  };

  const handleDeleteIncident = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this emergency incident record?')) return;
    try {
      await deleteIncident(id);
      showNotification('success', 'Incident record deleted successfully');
      setIncidents(incidents.filter(i => (i.incident_id || i.id) !== id));
      if ((selectedIncident?.incident_id || selectedIncident?.id) === id) {
        setSelectedIncident(null);
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to delete incident. Authentication required.');
    }
  };

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleOpenCreateReport = () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showNotification('info', 'Please sign in or register to log an emergency incident.');
    } else {
      setIsCreateOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      
      {/* Real-time System Telemetry Header */}
      <SystemHealthBar />

      {/* Main Command Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenCreate={handleOpenCreateReport}
        onRefresh={fetchIncidents}
        isLoading={loading}
        onFocusSearch={focusSearch}
      />

      {/* Dashboard Body Area */}
      <main style={{ maxWidth: '1380px', width: '100%', margin: '0 auto', padding: '0 1.5rem 3rem', flex: 1 }}>
        
        {/* Real-time SOC Stat Cards */}
        <StatCards incidents={incidents} />

        {/* Filter Controls & Search */}
        {currentUser && (
          <IncidentFilter
            filters={filters}
            setFilters={setFilters}
            onReset={() => setFilters({ category: '', status: '', priority: '', search: '' })}
            totalCount={incidents.length}
            searchInputRef={searchInputRef}
          />
        )}

        {/* Error Alert Banner */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.14)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            color: '#f87171',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{error}</span>
            </div>

            <button className="btn btn-outline btn-sm" onClick={fetchIncidents} style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>
              <RefreshCw size={14} /> Retry Connection
            </button>
          </div>
        )}

        {/* UNAUTHENTICATED SCREEN: When no user is logged in */}
        {!currentUser ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4.5rem 2rem', background: 'rgba(22, 28, 44, 0.7)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.12)', width: '84px', height: '84px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <Lock size={42} color="#60a5fa" />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 700 }}>
              Authentication Required
            </h3>
            <p style={{ color: '#94a3b8', maxWidth: '520px', margin: '0 auto 1.75rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Incident Command Telemetry is protected. Please sign in or register an account to access live emergency incident feeds, report incidents, and manage operator dispatches.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setIsAuthOpen(true)} style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}>
                <LogIn size={18} /> Sign In / Register
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED SCREEN: Shows real backend data */
          <>
            {/* Incident Feed Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem', borderRadius: '8px' }}>
                  <ShieldAlert size={20} color="#3b82f6" />
                </div>
                <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Live Emergency Incident Feed</span>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 }}>
                    ({incidents.length} active records in database)
                  </span>
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* View Mode Toggle */}
                <div style={{ display: 'flex', background: 'rgba(15, 20, 31, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2px' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '0.3rem 0.6rem' }}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '0.3rem 0.6rem' }}
                    title="Dense List View"
                  >
                    <List size={15} />
                  </button>
                </div>

                <button className="btn btn-primary btn-sm" onClick={handleOpenCreateReport}>
                  <PlusCircle size={15} /> Log Emergency Report
                </button>
              </div>
            </div>

            {/* Loading State with Shimmer Skeleton Cards */}
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
                gap: '1.25rem'
              }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            ) : incidents.length === 0 ? (
              /* Real Database Empty State */
              <div className="glass-panel" style={{ textAlign: 'center', padding: '4.5rem 2rem', background: 'rgba(22, 28, 44, 0.6)' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <ShieldAlert size={42} color="#64748b" />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.5rem', fontWeight: 700 }}>
                  No Real Incidents in Database
                </h3>
                <p style={{ color: '#94a3b8', maxWidth: '460px', margin: '0 auto 1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  There are currently no real incident reports recorded in the backend database. Log an emergency report to populate the real incident feed.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  <button className="btn btn-outline" onClick={() => setFilters({ category: '', status: '', priority: '', search: '' })}>
                    Reset Search Filters
                  </button>
                  <button className="btn btn-primary" onClick={handleOpenCreateReport}>
                    <PlusCircle size={16} /> Log Emergency Report
                  </button>
                </div>
              </div>
            ) : (
              /* Real Incident Feed Grid or List */
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
                gap: '1.25rem'
              }}>
                {incidents.map((incident) => (
                  <IncidentCard
                    key={incident.incident_id || incident.id}
                    incident={incident}
                    onViewDetails={(inc) => setSelectedIncident(inc)}
                    onDelete={handleDeleteIncident}
                    currentUser={currentUser}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 21, 33, 0.95)',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.8125rem'
      }}>
        Emergency Incident Response Command Center &bull; Enterprise SOC Console v2.4 &bull; API Endpoint: <code>http://52.63.212.154</code>
      </footer>

      {/* Modals & Toast Notifications */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(msg, user) => {
          setCurrentUser(user);
          showNotification('success', msg);
          fetchIncidents();
        }}
      />

      <CreateIncidentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(msg) => {
          showNotification('success', msg);
          fetchIncidents();
        }}
      />

      <IncidentDetailModal
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        incident={selectedIncident}
        onUpdateSuccess={(msg, updated) => {
          showNotification('success', msg);
          setSelectedIncident(updated);
          fetchIncidents();
        }}
        currentUser={currentUser}
      />

      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

    </div>
  );
}
