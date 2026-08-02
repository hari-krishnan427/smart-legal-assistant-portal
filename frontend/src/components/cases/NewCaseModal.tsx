import React, { useState } from 'react';
import { caseService } from '../../services/caseService';
import type { CasePriority, CaseStatus, CaseType, CreateCaseRequest } from '../../types/case';
import { X, Briefcase, AlertCircle } from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: () => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose, onCaseCreated }) => {
  const [formData, setFormData] = useState<CreateCaseRequest>({
    title: '',
    caseType: 'CIVIL',
    status: 'OPEN',
    priority: 'MEDIUM',
    courtName: '',
    judgeName: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    description: '',
    filingDate: new Date().toISOString().split('T')[0],
    nextHearingDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.clientName.trim()) {
      setError('Please fill in case title and client name.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await caseService.createCase(formData);
      if (response.success) {
        onCaseCreated();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log new legal case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '680px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={22} style={{ color: 'var(--accent-gold)' }} /> Log New Legal Case
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--accent-red)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Title & Case Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Case Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Corp vs. Nexus Tech Patent Dispute"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Case Type</label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData({ ...formData, caseType: e.target.value as CaseType })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              >
                <option value="CIVIL" style={{ background: '#111' }}>Civil Litigation</option>
                <option value="CORPORATE" style={{ background: '#111' }}>Corporate Law</option>
                <option value="INTELLECTUAL_PROPERTY" style={{ background: '#111' }}>IP & Patent</option>
                <option value="FAMILY" style={{ background: '#111' }}>Family Law</option>
                <option value="CRIMINAL" style={{ background: '#111' }}>Criminal Defense</option>
                <option value="LABOR" style={{ background: '#111' }}>Labor & Employment</option>
                <option value="GENERAL_LITIGATION" style={{ background: '#111' }}>General Litigation</option>
              </select>
            </div>
          </div>

          {/* Status & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStatus })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              >
                <option value="OPEN" style={{ background: '#111' }}>Open / Initiated</option>
                <option value="IN_PROGRESS" style={{ background: '#111' }}>In Progress / Trial</option>
                <option value="PENDING_HEARING" style={{ background: '#111' }}>Pending Hearing</option>
                <option value="CLOSED" style={{ background: '#111' }}>Closed / Settled</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as CasePriority })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              >
                <option value="LOW" style={{ background: '#111' }}>Low Priority</option>
                <option value="MEDIUM" style={{ background: '#111' }}>Medium Priority</option>
                <option value="HIGH" style={{ background: '#111' }}>High Priority</option>
                <option value="URGENT" style={{ background: '#111' }}>Urgent Action Required</option>
              </select>
            </div>
          </div>

          {/* Client Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Client Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe / Corp"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Client Email</label>
              <input
                type="email"
                placeholder="client@example.com"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Client Phone</label>
              <input
                type="text"
                placeholder="+1 555-0192"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>
          </div>

          {/* Court & Hearing Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Court Name</label>
              <input
                type="text"
                placeholder="District High Court"
                value={formData.courtName}
                onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Presiding Judge</label>
              <input
                type="text"
                placeholder="Hon. Judge Smith"
                value={formData.judgeName}
                onChange={(e) => setFormData({ ...formData, judgeName: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Filing Date</label>
              <input
                type="date"
                value={formData.filingDate}
                onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Next Hearing Date</label>
              <input
                type="date"
                value={formData.nextHearingDate}
                onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Case Summary & Description</label>
            <textarea
              rows={3}
              placeholder="Enter brief background, claims, or legal strategy overview..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.65rem 1.25rem', background: 'none', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
              {loading ? 'Logging Case...' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
