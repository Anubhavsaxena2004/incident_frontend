import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import { X, Clock, MapPin, Shield, User, History, Activity, Edit, AlertCircle, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { updateIncident, getIncidentTimeline, getIncidentAssignments } from '../api/client';

export default function IncidentDetailModal({ isOpen, onClose, incident, onUpdateSuccess, currentUser }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeline, setTimeline] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const incidentId = incident?.incident_id || incident?.id;
  const isOperatorOrAdmin = currentUser && (currentUser.role === 'OPERATOR' || currentUser.role === 'ADMIN');

  const [updateData, setUpdateData] = useState({
    status: incident?.status || 'REPORTED',
    priority: incident?.priority || 'MEDIUM',
    remarks: '',
    assigned_to: typeof incident?.assigned_to === 'object' ? incident?.assigned_to?.id : (incident?.assigned_to || ''),
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (incident) {
      setUpdateData({
        status: incident.status || 'REPORTED',
        priority: incident.priority || 'MEDIUM',
        remarks: '',
        assigned_to: typeof incident.assigned_to === 'object' ? incident.assigned_to?.id : (incident.assigned_to || ''),
      });
      fetchAuditData();
    }
  }, [incident]);

  const fetchAuditData = async () => {
    if (!incidentId) return;
    setLoadingAudit(true);
    try {
      const [tlRes, assignRes] = await Promise.allSettled([
        getIncidentTimeline(incidentId),
        getIncidentAssignments(incidentId)
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

    if (!isOperatorOrAdmin) {
      setUpdateError('Access Restricted: Workflow updates and operator dispatches require Operator or Admin account role.');
      return;
    }

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
        setUpdateError('No status, priority, remarks, or assignment changes were modified.');
        setUpdateLoading(false);
        return;
      }

      const updated = await updateIncident(incidentId, payload);
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
        setUpdateError('Failed to update incident workflow. Operator or Admin privileges required.');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  const assignedName = incident.assigned_to_name || (typeof incident.assigned_to === 'object' ? incident.assigned_to?.username : (incident.assigned_to ? `Operator #${incident.assigned_to}` : 'Unassigned'));
  const reportedByName = typeof incident.reported_by === 'object' ? incident.reported_by?.username : (incident.reported_by_username || 'Anonymous Reporter');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(22, 28, 44, 0.95)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <StatusBadge type="status" value={incident.status} />
              <StatusBadge type="priority" value={incident.priority} />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                ID: #{incidentId ? String(incidentId).substring(0, 8) : 'N/A'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
              {incident.title}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Header Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 20, 31, 0.6)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              flex: 1, padding: '0.75rem', border: 'none', background: 'none',
              color: activeTab === 'overview' ? '#60a5fa' : '#94a3b8',
              borderBottom: activeTab === 'overview' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.875rem'
            }}
          >
            <Activity size={15} /> Overview
          </button>

          <button
            onClick={() => setActiveTab('update')}
            style={{
              flex: 1, padding: '0.75rem', border: 'none', background: 'none',
              color: activeTab === 'update' ? '#60a5fa' : '#94a3b8',
              borderBottom: activeTab === 'update' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.875rem'
            }}
          >
            {isOperatorOrAdmin ? <Edit size={15} /> : <Lock size={14} color="#f59e0b" />}
            <span>Workflow & Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              flex: 1, padding: '0.75rem', border: 'none', background: 'none',
              color: activeTab === 'timeline' ? '#60a5fa' : '#94a3b8',
              borderBottom: activeTab === 'timeline' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.875rem'
            }}
          >
            <Clock size={15} /> Audit Timeline ({timeline.length})
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            style={{
              flex: 1, padding: '0.75rem', border: 'none', background: 'none',
              color: activeTab === 'assignments' ? '#60a5fa' : '#94a3b8',
              borderBottom: activeTab === 'assignments' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.875rem'
            }}
          >
            <History size={15} /> Assignments ({assignments.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '1.5rem', minHeight: '280px' }}>
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                  Emergency Description
                </h4>
                <p style={{ color: '#f8fafc', fontSize: '0.95rem', background: 'rgba(15, 20, 31, 0.7)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.5 }}>
                  {incident.description || 'No detailed description recorded for this incident.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(15, 20, 31, 0.7)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Location & GPS</div>
                  <div style={{ fontSize: '0.925rem', color: '#f8fafc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
                    <MapPin size={16} color="#3b82f6" />
                    <span>{incident.address}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    GPS: {incident.latitude}, {incident.longitude}
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 20, 31, 0.7)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Responder</div>
                  <div style={{ fontSize: '0.925rem', color: '#c084fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
                    <User size={16} />
                    <span>{assignedName}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Reporter: {reportedByName} &bull; Logged: {formatDate(incident.created_at)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. WORKFLOW & STATUS UPDATE */}
          {activeTab === 'update' && (
            <div>
              {!isOperatorOrAdmin ? (
                <div style={{
                  padding: '1.25rem',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  color: '#fbbf24',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <Lock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      Operator & Admin Dispatch Controls Only
                    </strong>
                    You are currently logged in as a <strong>{currentUser?.role || 'CITIZEN'}</strong>. Workflow state transitions, priority escalations, and operator assignments are restricted to authorized Operator and Admin accounts. Citizens can view the live Incident Overview and Audit Timelines.
                  </div>
                </div>
              ) : (
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
                    <label className="form-label">Operator Dispatch Notes / Action Logs</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="e.g. Dispatched HAZMAT Unit 4 to scene. Emergency situation under active containment."
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
                    {updateLoading ? 'Saving Changes...' : 'Update Incident Dispatch Workflow'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 3. AUDIT TIMELINE */}
          {activeTab === 'timeline' && (
            <div>
              {loadingAudit ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading timeline telemetry...</div>
              ) : timeline.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No status transition events logged yet.</div>
              ) : (
                <div style={{ borderLeft: '2px solid rgba(59, 130, 246, 0.3)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {timeline.map((item, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: '-1.65rem', top: '0.2rem', width: '12px', height: '12px',
                        borderRadius: '50%', background: '#3b82f6', border: '2px solid #161c2b'
                      }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.7rem' }}>
                            {item.old_status || 'INIT'}
                          </span>
                          <ArrowRight size={12} color="#94a3b8" />
                          <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', fontSize: '0.7rem' }}>
                            {item.new_status || item.status}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatDate(item.timestamp || item.created_at)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                        {item.remarks || item.description || 'Status transition recorded.'}
                      </div>
                      {item.updated_by && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                          By: {typeof item.updated_by === 'object' ? item.updated_by?.username : (item.updated_by_name || `User #${item.updated_by}`)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. ASSIGNMENT HISTORY */}
          {activeTab === 'assignments' && (
            <div>
              {loadingAudit ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading assignment history...</div>
              ) : assignments.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No operator reassignments logged yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {assignments.map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(15, 20, 31, 0.7)', padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <div style={{ fontWeight: 600, color: '#c084fc', fontSize: '0.875rem' }}>
                          Assigned Responder: {typeof item.assigned_to === 'object' ? item.assigned_to?.username : (item.assigned_to_name || `Operator #${item.assigned_to}`)}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatDate(item.assigned_at || item.created_at)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                        {item.remarks || 'Assignment updated.'}
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
