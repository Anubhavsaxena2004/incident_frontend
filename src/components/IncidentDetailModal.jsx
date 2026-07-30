import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Shield, User, History, Activity, Edit, AlertCircle, CheckCircle } from 'lucide-react';
import { updateIncident, getIncidentTimeline, getIncidentAssignments } from '../api/client';

export default function IncidentDetailModal({ isOpen, onClose, incident, onUpdateSuccess, currentUser }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'update', 'timeline', 'assignments'
  const [timeline, setTimeline] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Update Form State
  const [updateData, setUpdateData] = useState({
    status: incident?.status || 'REPORTED',
    priority: incident?.priority || 'MEDIUM',
    remarks: '',
    assigned_to: incident?.assigned_to || '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (incident) {
      setUpdateData({
        status: incident.status || 'REPORTED',
        priority: incident.priority || 'MEDIUM',
        remarks: '',
        assigned_to: incident.assigned_to || '',
      });
      fetchAuditData();
    }
  }, [incident]);

  const fetchAuditData = async () => {
    if (!incident) return;
    setLoadingAudit(true);
    try {
      const [tlRes, assignRes] = await Promise.allSettled([
        getIncidentTimeline(incident.id),
        getIncidentAssignments(incident.id)
      ]);
      
      if (tlRes.status === 'fulfilled') {
        setTimeline(Array.isArray(tlRes.value) ? tlRes.value : (tlRes.value.results || []));
      }
      if (assignRes.status === 'fulfilled') {
        setAssignments(Array.isArray(assignRes.value) ? assignRes.value : (assignRes.value.results || []));
      }
    } catch (err) {
      console.warn('Failed to load audit data', err);
    } finally {
      setLoadingAudit(false);
    }
  };

  if (!isOpen || !incident) return null;

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateLoading(true);

    try {
      const payload = {};
      if (updateData.status && updateData.status !== incident.status) payload.status = updateData.status;
      if (updateData.priority && updateData.priority !== incident.priority) payload.priority = updateData.priority;
      if (updateData.remarks.trim()) payload.remarks = updateData.remarks.trim();
      
      if (updateData.assigned_to !== '' && updateData.assigned_to !== null) {
        const numId = parseInt(updateData.assigned_to, 10);
        if (!isNaN(numId) && numId > 0) {
          payload.assigned_to = numId;
        }
      }

      if (Object.keys(payload).length === 0) {
        setUpdateError('No changes detected in status, priority, remarks, or assignment.');
        setUpdateLoading(false);
        return;
      }

      const updated = await updateIncident(incident.id, payload);
      onUpdateSuccess('Incident workflow updated successfully!', updated);
      fetchAuditData();
      setActiveTab('timeline');
    } catch (err) {
      console.error(err);
      const errRes = err.response?.data;
      if (typeof errRes === 'object') {
        const firstKey = Object.keys(errRes)[0];
        const msg = Array.isArray(errRes[firstKey]) ? errRes[firstKey][0] : errRes[firstKey];
        setUpdateError(`${firstKey}: ${msg}`);
      } else {
        setUpdateError('Failed to update incident. Operator permissions may be required.');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-status">{incident.status}</span>
              <span className="badge badge-critical">{incident.priority}</span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {incident.id}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
              {incident.title}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              flex: 1, padding: '0.75rem', border: 'none', background: 'none',
              color: activeTab === 'overview' ? '#3b82f6' : '#9ca3af',
              borderBottom: activeTab === 'overview' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
            }}
          >
            <Activity size={15} /> Overview
          </button>

          <button
            onClick={() => setActiveTab('update')}
            style={{
              flex: 1, padding: '0.75rem', border: 'none', background: 'none',
              color: activeTab === 'update' ? '#3b82f6' : '#9ca3af',
              borderBottom: activeTab === 'update' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
            }}
          >
            <Edit size={15} /> Workflow & Status
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              flex: 1, padding: '0.75rem', border: 'none', background: 'none',
              color: activeTab === 'timeline' ? '#3b82f6' : '#9ca3af',
              borderBottom: activeTab === 'timeline' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
            }}
          >
            <Clock size={15} /> Timeline ({timeline.length})
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            style={{
              flex: 1, padding: '0.75rem', border: 'none', background: 'none',
              color: activeTab === 'assignments' ? '#3b82f6' : '#9ca3af',
              borderBottom: activeTab === 'assignments' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
            }}
          >
            <History size={15} /> Assignments ({assignments.length})
          </button>
        </div>

        {/* Modal Tab Contents */}
        <div style={{ padding: '1.5rem', minHeight: '280px' }}>
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8125rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Description
                </h4>
                <p style={{ color: '#e5e7eb', fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {incident.description || 'No detailed description.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.875rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Location & Coordinates</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <MapPin size={15} color="#3b82f6" />
                    <span>{incident.address}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>
                    GPS: {incident.latitude}, {incident.longitude}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.875rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Assigned Responder</div>
                  <div style={{ fontSize: '0.9rem', color: '#c084fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <User size={15} />
                    <span>{incident.assigned_to_name || (incident.assigned_to ? `Operator #${incident.assigned_to}` : 'Unassigned')}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>
                    Created: {formatDate(incident.created_at)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. WORKFLOW UPDATE */}
          {activeTab === 'update' && (
            <form onSubmit={handleUpdateSubmit}>
              {updateError && (
                <div style={{
                  padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px', color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <AlertCircle size={16} /> {updateError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Update Status</label>
                  <select
                    className="form-control"
                    value={updateData.status}
                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  >
                    <option value="REPORTED">Reported</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In-Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Update Priority</label>
                  <select
                    className="form-control"
                    value={updateData.priority}
                    onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assign Operator ID (Optional)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter User ID of Operator (e.g. 2)"
                  value={updateData.assigned_to}
                  onChange={(e) => setUpdateData({ ...updateData, assigned_to: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Operator Remarks / Dispatch Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Dispatching Operator Bob to contain the leak. Emergency personnel on site."
                  value={updateData.remarks}
                  onChange={(e) => setUpdateData({ ...updateData, remarks: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={updateLoading}
              >
                {updateLoading ? 'Saving Changes...' : 'Update Incident Workflow'}
              </button>
            </form>
          )}

          {/* 3. TIMELINE */}
          {activeTab === 'timeline' && (
            <div>
              {loadingAudit ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Loading timeline events...</div>
              ) : timeline.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No status transitions recorded yet.</div>
              ) : (
                <div style={{ borderLeft: '2px solid rgba(59, 130, 246, 0.3)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {timeline.map((item, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: '-1.65rem', top: '0.2rem', width: '12px', height: '12px',
                        borderRadius: '50%', background: '#3b82f6', border: '2px solid #0b0f19'
                      }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span className="badge badge-status" style={{ fontSize: '0.7rem' }}>
                          {item.old_status || 'INIT'} ➔ {item.new_status || item.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {formatDate(item.timestamp || item.created_at)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
                        {item.remarks || item.description || 'Status transition logged.'}
                      </div>
                      {item.updated_by && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                          By: {item.updated_by_name || `User #${item.updated_by}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div>
              {loadingAudit ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Loading assignment history...</div>
              ) : assignments.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No operator reassignments recorded yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {assignments.map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <div style={{ fontWeight: 600, color: '#c084fc', fontSize: '0.875rem' }}>
                          Assigned to: {item.assigned_to_name || `Operator #${item.assigned_to}`}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {formatDate(item.assigned_at || item.created_at)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
                        {item.remarks || 'Assignment updated'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
