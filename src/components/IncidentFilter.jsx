import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function IncidentFilter({ filters, setFilters, onReset }) {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'ACCIDENT', label: 'Accident' },
    { value: 'FIRE', label: 'Fire Emergency' },
    { value: 'CRIME', label: 'Crime / Security' },
    { value: 'MEDICAL', label: 'Medical Emergency' },
    { value: 'NATURAL_DISASTER', label: 'Natural Disaster' },
    { value: 'OTHER', label: 'Other Incident' },
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

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        alignItems: 'center'
      }}>
        
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search title, description, or address..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Category Selector */}
        <div>
          <select
            className="form-control"
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value} style={{ background: '#111827' }}>
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
              <option key={s.value} value={s.value} style={{ background: '#111827' }}>
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
              <option key={p.value} value={p.value} style={{ background: '#111827' }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            className="btn btn-outline btn-sm"
            style={{ width: '100%', height: '42px' }}
            onClick={onReset}
          >
            <RotateCcw size={15} />
            <span>Reset Filters</span>
          </button>
        </div>

      </div>
    </div>
  );
}
