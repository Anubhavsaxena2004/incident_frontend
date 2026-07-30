import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import IncidentFilter from './components/IncidentFilter';
import IncidentCard from './components/IncidentCard';
import AuthModal from './components/AuthModal';
import CreateIncidentModal from './components/CreateIncidentModal';
import IncidentDetailModal from './components/IncidentDetailModal';
import NotificationToast from './components/NotificationToast';
import { getIncidents, getCurrentUser, deleteIncident, logoutUser } from './api/client';
import { ShieldAlert, AlertCircle, PlusCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Notification Toast state
  const [notification, setNotification] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    search: '',
  });

  // Load initial session and incidents
  useEffect(() => {
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    fetchCurrentUser();
    fetchIncidents();

    // Listen for auto-logout event from API interceptor
    const handleAutoLogout = () => {
      setCurrentUser(null);
      showNotification('error', 'Session expired. Please log in again.');
    };
    window.addEventListener('auth:logout', handleAutoLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAutoLogout);
    };
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      localStorage.setItem('user_info', JSON.stringify(user));
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
    }
  };

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncidents(filters);
      const list = Array.isArray(data) ? data : (data.results || []);
      setIncidents(list);
    } catch (err) {
      console.error('Failed to load incidents:', err);
      setError('Could not connect to incident backend service (http://52.63.212.154). Please check connection or login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    showNotification('success', 'Logged out successfully');
  };

  const handleDeleteIncident = async (id) => {
    if (!window.confirm('Are you sure you want to delete this emergency incident record?')) return;
    try {
      await deleteIncident(id);
      showNotification('success', 'Incident record deleted successfully');
      setIncidents(incidents.filter(i => i.id !== id));
      if (selectedIncident?.id === id) {
        setSelectedIncident(null);
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to delete incident. Authentication required.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenCreate={() => setIsCreateOpen(true)}
        onRefresh={fetchIncidents}
        isLoading={loading}
      />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 1.5rem 3rem', flex: 1 }}>
        
        {/* Realtime Stat Cards */}
        <StatCards incidents={incidents} />

        {/* Filter Controls */}
        <IncidentFilter
          filters={filters}
          setFilters={setFilters}
          onReset={() => setFilters({ category: '', status: '', priority: '', search: '' })}
        />

        {/* Error Alert Banner */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            color: '#f87171',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem' }}>{error}</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={fetchIncidents}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Incidents Grid */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} color="#3b82f6" />
            <span>Emergency Incident Feed</span>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: 400 }}>({incidents.length} found)</span>
          </h2>

          <button className="btn btn-primary btn-sm" onClick={() => setIsCreateOpen(true)}>
            <PlusCircle size={15} /> Log New Emergency
          </button>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-panel" style={{ height: '220px', opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <ShieldAlert size={48} color="#6b7280" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#e5e7eb', marginBottom: '0.5rem' }}>
              No Incidents Matched
            </h3>
            <p style={{ color: '#9ca3af', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              No active emergency reports match your current filter parameters. Submit a new report or adjust filters.
            </p>
            <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
              <PlusCircle size={16} /> Submit First Incident Report
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}>
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onViewDetails={(inc) => setSelectedIncident(inc)}
                onDelete={handleDeleteIncident}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(11, 15, 25, 0.95)',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.8125rem'
      }}>
        Emergency Incident Reporting System Microservice &bull; API Target: <code>http://52.63.212.154</code>
      </footer>

      {/* Modals & Toasts */}
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
