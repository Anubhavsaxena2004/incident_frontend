import React from 'react';
import { Search, Filter, RotateCcw, X, Layers, Flame, AlertCircle } from 'lucide-react';

export default function IncidentFilter({ filters, setFilters, onReset, totalCount, searchInputRef }) {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'ACCIDENT', label: 'Car Accident' },
    { value: 'FIRE', label: 'Fire Emergency' },
    { value: 'CRIME', label: 'Crime / Security' },
    { value: 'MEDICAL', label: 'Medical Emergency' },
    { value: 'NATURAL_DISASTER', label: 'Natural Disaster' },
    { value: 'OTHER', label: 'Other' },
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'REPORTED', label: 'Reported' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'IN_PROGRESS', label: 'In-Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const hasActiveFilters = filters.category || filters.status || filters.priority || filters.search;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.75rem', background: 'rgba(22, 28, 44, 0.8)' }}>
      
      {/* Top Bar: Quick Filter Pills & Reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '0.25rem' }}>
            Quick Filters:
          </span>

          <button
            className={`btn btn-sm ${!filters.priority && !filters.status ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilters({ ...filters, priority: '', status: '' })}
            style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
          >
            All Feed ({totalCount || 0})
          </button>

          <button
            className={`btn btn-sm ${filters.priority === 'CRITICAL' ? 'btn-danger' : 'btn-outline'}`}
            onClick={() => setFilters({ ...filters, priority: filters.priority === 'CRITICAL' ? '' : 'CRITICAL' })}
            style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
          >
            <AlertCircle size={13} />
            Critical Only
          </button>

          <button
            className={`btn btn-sm ${filters.status === 'IN_PROGRESS' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilters({ ...filters, status: filters.status === 'IN_PROGRESS' ? '' : 'IN_PROGRESS' })}
            style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
          >
            Active Response
          </button>

          <button
            className={`btn btn-sm ${filters.status === 'REPORTED' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilters({ ...filters, status: filters.status === 'REPORTED' ? '' : 'REPORTED' })}
            style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
          >
            Pending Review
          </button>
        </div>

        {hasActiveFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={onReset}
            style={{ color: '#ef4444' }}
          >
            <RotateCcw size={13} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Filter Inputs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.875rem',
        alignItems: 'center'
      }}>
        
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            ref={searchInputRef}
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.5rem', paddingRight: filters.search ? '2.5rem' : '0.875rem' }}
            placeholder="Search title, address, description... (/)"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ ...filters, search: '' })}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Selector */}
        <div>
          <select
            className="form-control"
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value} style={{ background: '#161c2b', color: '#f8fafc' }}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <select
            className="form-control"
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value} style={{ background: '#161c2b', color: '#f8fafc' }}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Selector */}
        <div>
          <select
            className="form-control"
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value} style={{ background: '#161c2b', color: '#f8fafc' }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
