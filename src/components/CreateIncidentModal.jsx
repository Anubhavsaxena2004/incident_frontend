import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, MapPin, Navigation, Flame, ShieldAlert, Cross, Car, AlertTriangle } from 'lucide-react';
import { createIncident } from '../api/client';

export default function CreateIncidentModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ACCIDENT',
    latitude: '50.110924',
    longitude: '8.682127',
    address: '',
    priority: 'MEDIUM',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        latitude: String(formData.latitude),
        longitude: String(formData.longitude),
        address: formData.address.trim() || 'Command Center Dispatch Zone 1',
        priority: formData.priority,
      };

      const created = await createIncident(payload);
      onSuccess('Emergency incident report dispatched successfully!', created);
      onClose();
    } catch (err) {
      console.error(err);
      const errRes = err.response?.data;
      if (typeof errRes === 'object') {
        const firstKey = Object.keys(errRes)[0];
        const msg = Array.isArray(errRes[firstKey]) ? errRes[firstKey][0] : errRes[firstKey];
        setError(`${firstKey}: ${msg}`);
      } else {
        setError('Failed to log emergency incident. Please verify inputs or authenticate.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: String(position.coords.latitude.toFixed(6)),
            longitude: String(position.coords.longitude.toFixed(6)),
          }));
          setGeoLoading(false);
        },
        (err) => {
          console.log('Geolocation skipped or prompt closed.');
          setGeoLoading(false);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  };

  const priorityOptions = [
    { value: 'LOW', label: 'Low', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
    { value: 'MEDIUM', label: 'Medium', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.15)' },
    { value: 'HIGH', label: 'High', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)' },
    { value: 'CRITICAL', label: 'Critical', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(22, 28, 44, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem', borderRadius: '8px' }}>
              <PlusCircle size={22} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
                Log New Emergency Report
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Dispatch incident alert to real-time SOC responder network
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            margin: '1rem 1.5rem 0',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          
          <div className="form-group">
            <label className="form-label">Incident Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Hazardous Spill on Main Highway / Power Outage Substation B"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Priority Grid Pills */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Priority Level *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: opt.value })}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: `1px solid ${formData.priority === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
                    background: formData.priority === opt.value ? opt.bg : 'rgba(15, 20, 31, 0.6)',
                    color: formData.priority === opt.value ? opt.color : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="ACCIDENT">Car Accident</option>
                <option value="FIRE">Fire Emergency</option>
                <option value="CRIME">Crime / Security</option>
                <option value="MEDICAL">Medical Emergency</option>
                <option value="NATURAL_DISASTER">Natural Disaster</option>
                <option value="OTHER">Other Incident</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Address / Location *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Sector 4, Building B, North Wing"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Coordinates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label">Latitude *</label>
              <input
                type="text"
                className="form-control"
                placeholder="50.110924"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude *</label>
              <input
                type="text"
                className="form-control"
                placeholder="8.682127"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginBottom: '1rem', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}
            onClick={handleUseCurrentLocation}
            disabled={geoLoading}
          >
            <Navigation size={14} className={geoLoading ? 'spin-icon' : ''} />
            <span>{geoLoading ? 'Fetching GPS Coordinates...' : 'Use Current Device Coordinates'}</span>
          </button>

          <div className="form-group">
            <label className="form-label">Incident Description *</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Detail hazards, victims, physical damage, casualties, or immediate emergency response required..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Dispatching Incident...' : 'Dispatch Emergency Report'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
