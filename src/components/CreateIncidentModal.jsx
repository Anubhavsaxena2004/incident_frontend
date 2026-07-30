import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, MapPin } from 'lucide-react';
import { createIncident } from '../api/client';

export default function CreateIncidentModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // Validate fields
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        latitude: String(formData.latitude),
        longitude: String(formData.longitude),
        address: formData.address.trim() || 'Sector 1, Main Command Area',
        priority: formData.priority,
      };

      const created = await createIncident(payload);
      onSuccess('Emergency incident logged successfully!', created);
      onClose();
    } catch (err) {
      console.error(err);
      const errRes = err.response?.data;
      if (typeof errRes === 'object') {
        const firstKey = Object.keys(errRes)[0];
        const msg = Array.isArray(errRes[firstKey]) ? errRes[firstKey][0] : errRes[firstKey];
        setError(`${firstKey}: ${msg}`);
      } else {
        setError('Failed to log incident. Please verify coordinates & required fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: String(position.coords.latitude.toFixed(6)),
            longitude: String(position.coords.longitude.toFixed(6)),
          }));
        },
        (err) => {
          console.warn(err);
          setError('Unable to fetch live GPS location. Default coordinates kept.');
        }
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.5rem', borderRadius: '8px' }}>
              <PlusCircle size={20} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
              Report New Emergency Incident
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
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
              placeholder="e.g. Chemical Spill in Warehouse B"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="ACCIDENT">Accident</option>
                <option value="FIRE">Fire Emergency</option>
                <option value="CRIME">Crime / Security</option>
                <option value="MEDICAL">Medical Emergency</option>
                <option value="NATURAL_DISASTER">Natural Disaster</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Priority</label>
              <select
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address / Location Description *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Building C, Sector 3, Industrial Park"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          {/* Coordinates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
            style={{ width: '100%', marginBottom: '1rem' }}
            onClick={handleUseCurrentLocation}
          >
            <MapPin size={14} /> Use Device GPS Coordinates
          </button>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Provide specific details about the emergency, trapped personnel, hazards, or immediate assistance needed..."
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
              {loading ? 'Submitting Report...' : 'Dispatch Emergency Report'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
