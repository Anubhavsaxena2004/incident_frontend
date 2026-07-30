import React from 'react';
import { MapPin, Clock, User, Eye, Trash2, ShieldAlert, Flame, Car, Cross, AlertTriangle, HelpCircle } from 'lucide-react';

export default function IncidentCard({ incident, onViewDetails, onDelete, currentUser }) {
  // Category Icons & colors
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'FIRE':
        return { icon: Flame, color: '#f97316' };
      case 'ACCIDENT':
        return { icon: Car, color: '#ef4444' };
      case 'MEDICAL':
        return { icon: Cross, color: '#10b981' };
      case 'CRIME':
        return { icon: ShieldAlert, color: '#8b5cf6' };
      case 'NATURAL_DISASTER':
        return { icon: AlertTriangle, color: '#eab308' };
      default:
        return { icon: HelpCircle, color: '#3b82f6' };
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const cat = getCategoryIcon(incident.category);
  const IconComp = cat.icon;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canDelete = currentUser && (currentUser.role === 'ADMIN' || incident.reported_by === currentUser.id || incident.reported_by_username === currentUser.username);

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      
      <div>
        {/* Top Header: Category Icon & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              background: `${cat.color}20`,
              border: `1px solid ${cat.color}40`,
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComp size={18} color={cat.color} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
              {incident.category || 'INCIDENT'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${getPriorityBadgeClass(incident.priority)}`}>
              {incident.priority || 'MEDIUM'}
            </span>
            <span className="badge badge-status">
              {incident.status || 'REPORTED'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {incident.title}
        </h3>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.875rem',
          color: '#9ca3af',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {incident.description || 'No description provided.'}
        </p>
      </div>

      {/* Metadata & Actions Footer */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.875rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78125rem', color: '#6b7280', marginBottom: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} color="#3b82f6" />
            <span style={{ color: '#d1d5db' }}>{incident.address || `${incident.latitude}, ${incident.longitude}`}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} />
              <span>{formatDate(incident.created_at)}</span>
            </div>
            {incident.assigned_to_name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#c084fc' }}>
                <User size={13} />
                <span>Assigned: {incident.assigned_to_name}</span>
              </div>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
            onClick={() => onViewDetails(incident)}
          >
            <Eye size={14} />
            <span>Details & Timeline</span>
          </button>

          {canDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(incident.id)}
              title="Delete Incident Record"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
