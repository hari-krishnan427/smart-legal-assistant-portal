import React, { useState, useEffect } from 'react';
import { caseService } from '../../services/caseService';
import { documentService } from '../../services/documentService';
import type { CaseResponse } from '../../types/case';
import type { LegalDocument } from '../../types/document';
import { useNavigate } from 'react-router-dom';
import { X, FileText, Plus, MessageSquare, Send, Sparkles } from 'lucide-react';

interface CaseDetailModalProps {
  caseId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onCaseUpdated: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ caseId, isOpen, onClose, onCaseUpdated }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'notes'>('overview');
  const [caseDetails, setCaseDetails] = useState<CaseResponse | null>(null);
  const [allUserDocs, setAllUserDocs] = useState<LegalDocument[]>([]);
  const [selectedDocIdToLink, setSelectedDocIdToLink] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen && caseId) {
      fetchCaseInfo();
      fetchAvailableDocuments();
    }
  }, [isOpen, caseId]);

  const fetchCaseInfo = async () => {
    if (!caseId) return;
    setLoading(true);
    try {
      const res = await caseService.getCaseById(caseId);
      if (res.success && res.data) {
        setCaseDetails(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      if (res.success && res.data) {
        setAllUserDocs(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId || !newNoteContent.trim() || actionLoading) return;

    setActionLoading(true);
    try {
      const res = await caseService.addNote(caseId, { content: newNoteContent.trim() });
      if (res.success) {
        setNewNoteContent('');
        fetchCaseInfo();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLinkDocument = async () => {
    if (!caseId || !selectedDocIdToLink || actionLoading) return;

    setActionLoading(true);
    try {
      const res = await caseService.linkDocument(caseId, Number(selectedDocIdToLink));
      if (res.success) {
        setSelectedDocIdToLink('');
        fetchCaseInfo();
        onCaseUpdated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen || !caseId) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '840px', width: '92%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="role-pill" style={{ background: 'rgba(229,185,100,0.15)', color: 'var(--accent-gold)' }}>
                {caseDetails?.caseNumber || 'LGL-CASE'}
              </span>
              <span className="role-tag" style={{ background: 'rgba(56,189,248,0.15)', color: 'var(--accent-blue)' }}>
                {caseDetails?.caseType}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{caseDetails?.title || 'Case Details'}</h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--panel-border)', marginTop: '1rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: activeTab === 'overview' ? 'var(--accent-gold)' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Overview & Hearing Timeline
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'documents' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: activeTab === 'documents' ? 'var(--accent-gold)' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <FileText size={16} /> Linked Documents ({caseDetails?.documents?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'notes' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: activeTab === 'notes' ? 'var(--accent-gold)' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <MessageSquare size={16} /> Case Notes Timeline ({caseDetails?.notes?.length || 0})
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ flex: 1, padding: '1.25rem 0', overflowY: 'auto' }}>
          {loading ? (
            <div className="spinner-container" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && caseDetails && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Grid Metadata */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CLIENT INFORMATION</span>
                      <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.05rem' }}>{caseDetails.clientName}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{caseDetails.clientEmail || 'No email registered'}</p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ASSIGNED COUNSEL</span>
                      <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.05rem' }}>{caseDetails.assignedLawyerName}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Lead Attorney</p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COURT & JUDGE</span>
                      <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.05rem' }}>{caseDetails.courtName || 'Unspecified Court'}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Judge: {caseDetails.judgeName || 'Pending'}</p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NEXT HEARING DATE</span>
                      <h4 style={{ margin: '0.25rem 0 0', fontSize: '1.05rem', color: 'var(--accent-gold)' }}>
                        {caseDetails.nextHearingDate ? new Date(caseDetails.nextHearingDate).toLocaleDateString() : 'No hearing scheduled'}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Filing Date: {caseDetails.filingDate || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CASE STRATEGY & DESCRIPTION</h4>
                    <p style={{ lineHeight: '1.6', fontSize: '0.9rem', color: '#e5e7eb', whiteSpace: 'pre-wrap' }}>
                      {caseDetails.description || 'No detailed description logged for this case.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: LINKED DOCUMENTS */}
              {activeTab === 'documents' && caseDetails && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Document Linker Bar */}
                  <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
                    <select
                      value={selectedDocIdToLink}
                      onChange={(e) => setSelectedDocIdToLink(e.target.value)}
                      style={{ flex: 1, padding: '0.5rem', background: '#111', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                    >
                      <option value="">-- Select uploaded document to link to case --</option>
                      {allUserDocs.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.originalFilename} ({doc.fileCategory})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleLinkDocument}
                      disabled={!selectedDocIdToLink || actionLoading}
                      className="btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <Plus size={16} /> Link Document
                    </button>
                  </div>

                  {/* Linked Docs List */}
                  {caseDetails.documents && caseDetails.documents.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {caseDetails.documents.map((doc) => (
                        <div
                          key={doc.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.85rem 1rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText size={20} style={{ color: 'var(--accent-blue)' }} />
                            <div>
                              <strong style={{ fontSize: '0.9rem' }}>{doc.originalFilename}</strong>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Category: {doc.fileCategory}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/documents/${doc.id}/analysis`);
                            }}
                            className="nav-link"
                            style={{ fontSize: '0.85rem' }}
                          >
                            <Sparkles size={14} /> View AI Risk Analysis
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No legal documents linked to this case yet.</p>
                  )}
                </div>
              )}

              {/* TAB 3: CASE NOTES TIMELINE */}
              {activeTab === 'notes' && caseDetails && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Post Note Form */}
                  <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Add an update note or court memo..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      style={{ flex: 1, padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                    />
                    <button type="submit" disabled={!newNoteContent.trim() || actionLoading} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                      <Send size={16} /> Post Note
                    </button>
                  </form>

                  {/* Notes Timeline Stream */}
                  {caseDetails.notes && caseDetails.notes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {caseDetails.notes.map((note) => (
                        <div key={note.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
                              {note.authorName} ({note.authorRole})
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#e5e7eb', margin: 0, lineHeight: 1.5 }}>{note.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No case notes posted yet.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
