import React from 'react';
import StatusBadge from './StatusBadge';
import { MapPin, Clock, User, Eye, Trash2, ShieldAlert, Flame, Car, Cross, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';

export default function IncidentCard({ incident, onViewDetails, onDelete, currentUser, viewMode = 'grid' }) {
  // Category Icons & thematic color accents
  const getCategoryTheme = (category) => {
    switch (String(category).toUpperCase()) {
      case 'FIRE':
        return { icon: Flame, color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
      case 'ACCIDENT':
        return { icon: Car, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
      case 'MEDICAL':
        return { icon: Cross, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'CRIME':
        return { icon: ShieldAlert, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' };
      case 'NATURAL_DISASTER':
        return { icon: AlertTriangle, color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' };
      default:
        return { icon: HelpCircle, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
    }
  };

  const cat = getCategoryTheme(incident.category);
  const IconComp = cat.icon;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canDelete = currentUser && (currentUser.role === 'ADMIN' || incident.reported_by === currentUser.id || incident.reported_by_username === currentUser.username);

  if (viewMode === 'list') {
    return (
      <div className="glass-panel glass-panel-hover" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
          <div style={{ background: cat.bg, border: `1px solid ${cat.color}40`, padding: '0.45rem', borderRadius: '8px', flexShrink: 0 }}>
            <IconComp size={18} color={cat.color} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>{incident.title}</h3>
              <StatusBadge type="priority" value={incident.priority} size="sm" />
              <StatusBadge type="status" value={incident.status} size="sm" />
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} color="#3b82f6" /> {incident.address}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {formatDate(incident.created_at)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => onViewDetails(incident)}>
            <Eye size={14} /> Details
          </button>
          {canDelete && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(incident.id)} title="Delete Record">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      
      <div>
        {/* Top Header: Category Icon & Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              background: cat.bg,
              border: `1px solid ${cat.color}40`,
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComp size={18} color={cat.color} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {incident.category || 'INCIDENT'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <StatusBadge type="priority" value={incident.priority} size="sm" />
            <StatusBadge type="status" value={incident.status} size="sm" />
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1.3, fontWeight: 700 }}>
          {incident.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.875rem',
          color: '#cbd5e1',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4
        }}>
          {incident.description || 'No detailed report description provided.'}
        </p>
      </div>

      {/* Footer Info & Action Bar */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.875rem', marginTop: '0.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78125rem', color: '#94a3b8', marginBottom: '0.875rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} color="#3b82f6" style={{ flexShrink: 0 }} />
            <span style={{ color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {incident.address || `${incident.latitude}, ${incident.longitude}`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} color="#64748b" />
              <span>{formatDate(incident.created_at)}</span>
            </div>

            {incident.assigned_to_name ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#c084fc', fontWeight: 600 }}>
                <User size={12} />
                <span>Operator: {incident.assigned_to_name}</span>
              </div>
            ) : (
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>Unassigned</span>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ flex: 1, borderColor: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa' }}
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
