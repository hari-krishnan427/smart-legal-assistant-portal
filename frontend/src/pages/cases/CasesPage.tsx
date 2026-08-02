import React, { useEffect, useState } from 'react';
import { caseService } from '../../services/caseService';
import type { CaseResponse, CaseStatus } from '../../types/case';
import { NewCaseModal } from '../../components/cases/NewCaseModal';
import { CaseDetailModal } from '../../components/cases/CaseDetailModal';
import { Briefcase, Search, Plus, LayoutGrid, Table as TableIcon, Eye } from 'lucide-react';

export const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<CaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<number | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const sf = statusFilter === 'ALL' ? undefined : statusFilter;
      const res = await caseService.getCases(searchQuery, sf);
      if (res.success && res.data) {
        setCases(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCases();
  };

  const kanbanColumns: { status: CaseStatus; title: string; color: string }[] = [
    { status: 'OPEN', title: 'Open / Initiated', color: '#38bdf8' },
    { status: 'IN_PROGRESS', title: 'In Progress / Trial', color: '#e5b964' },
    { status: 'PENDING_HEARING', title: 'Pending Hearing', color: '#a855f7' },
    { status: 'CLOSED', title: 'Closed / Settled', color: '#34d399' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Bar */}
      <div className="dashboard-hero glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Briefcase size={28} style={{ color: 'var(--accent-gold)' }} /> Case & Client Management
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Track court proceedings, hearing timelines, client matters, and linked legal documents.
            </p>
          </div>

          <button onClick={() => setIsNewModalOpen(true)} className="btn-primary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}>
            <Plus size={18} /> Log New Legal Case
          </button>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search case number, title, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.875rem' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
            Search
          </button>
        </form>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              padding: '0.4rem 0.75rem',
              background: viewMode === 'kanban' ? 'var(--accent-gold)' : 'none',
              color: viewMode === 'kanban' ? '#111' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <LayoutGrid size={14} /> Kanban Board
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '0.4rem 0.75rem',
              background: viewMode === 'table' ? 'var(--accent-gold)' : 'none',
              color: viewMode === 'table' ? '#111' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <TableIcon size={14} /> Data Table
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(['ALL', 'OPEN', 'IN_PROGRESS', 'PENDING_HEARING', 'CLOSED'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className="category-pill"
            style={{
              background: statusFilter === st ? 'rgba(229,185,100,0.2)' : 'rgba(255,255,255,0.03)',
              color: statusFilter === st ? 'var(--accent-gold)' : 'var(--text-muted)',
              border: `1px solid ${statusFilter === st ? 'rgba(229,185,100,0.4)' : 'var(--panel-border)'}`,
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: statusFilter === st ? 700 : 500,
              cursor: 'pointer',
            }}
          >
            {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="spinner-container" style={{ minHeight: '400px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading legal case portfolio...</p>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'flex-start' }}>
          {kanbanColumns.map((col) => {
            const colCases = cases.filter((c) => c.status === col.status);
            return (
              <div key={col.status} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: `2px solid ${col.color}` }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: col.color }}>{col.title}</span>
                  <span className="role-tag" style={{ background: `${col.color}20`, color: col.color }}>{colCases.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {colCases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setActiveCaseId(c.id)}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{c.caseNumber}</span>
                        <span className="role-tag" style={{ background: c.priority === 'URGENT' || c.priority === 'HIGH' ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.05)', color: c.priority === 'URGENT' || c.priority === 'HIGH' ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                          {c.priority}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.95rem', margin: '0.25rem 0 0.5rem', lineHeight: 1.4 }}>{c.title}</h4>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span>👤 Client: {c.clientName}</span>
                        {c.nextHearingDate && (
                          <span style={{ color: 'var(--accent-gold)' }}>🗓️ Hearing: {new Date(c.nextHearingDate).toLocaleDateString()}</span>
                        )}
                        <span>📄 Docs: {c.documents?.length || 0}</span>
                      </div>
                    </div>
                  ))}

                  {colCases.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '2rem 0' }}>No cases in this status column.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>Case Number</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>Title</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>Client</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>Next Hearing</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{c.caseNumber}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{c.title}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{c.caseType}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="role-pill" style={{ fontSize: '0.75rem' }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>{c.clientName}</td>
                  <td style={{ padding: '0.85rem 1rem', color: c.nextHearingDate ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                    {c.nextHearingDate ? new Date(c.nextHearingDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button onClick={() => setActiveCaseId(c.id)} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                      <Eye size={14} /> Open Drawer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Case Modal */}
      <NewCaseModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCaseCreated={fetchCases}
      />

      {/* Case Detail Drawer Modal */}
      <CaseDetailModal
        caseId={activeCaseId}
        isOpen={activeCaseId !== null}
        onClose={() => setActiveCaseId(null)}
        onCaseUpdated={fetchCases}
      />
    </div>
  );
};
