import React, { useEffect, useState } from 'react';
import { documentService } from '../../services/documentService';
import type { LegalDocument } from '../../types/document';
import { DocumentUploader } from '../../components/documents/DocumentUploader';
import { DocumentDetailModal } from '../../components/documents/DocumentDetailModal';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Download, Eye, Trash2, Filter, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<LegalDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeModalDoc, setActiveModalDoc] = useState<LegalDocument | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDocuments = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await documentService.getDocuments(query);
      if (response.success && response.data) {
        setDocuments(response.data);
        setFilteredDocuments(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch legal documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    let result = documents;

    if (selectedCategory !== 'ALL') {
      result = result.filter((doc) => doc.fileCategory === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (doc) =>
          doc.originalFilename.toLowerCase().includes(q) ||
          (doc.extractedText && doc.extractedText.toLowerCase().includes(q))
      );
    }

    setFilteredDocuments(result);
  }, [searchQuery, selectedCategory, documents]);

  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments(searchQuery);
  };

  const handleDownload = async (doc: LegalDocument) => {
    try {
      await documentService.downloadDocument(doc.id, doc.originalFilename);
    } catch {
      alert('Failed to download document.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this legal document? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await documentService.deleteDocument(id);
      if (response.success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        if (activeModalDoc?.id === id) {
          setActiveModalDoc(null);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete document. Ensure you are the document owner or an administrator.');
    } finally {
      setDeletingId(null);
    }
  };

  const getFormatBadgeColor = (contentType: string) => {
    if (contentType.includes('pdf')) return '#f87171'; // Red
    if (contentType.includes('word') || contentType.includes('officedocument')) return '#38bdf8'; // Blue
    return '#34d399'; // Green
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Banner */}
      <div className="dashboard-hero glass-panel">
        <div className="hero-content">
          <h1>Legal Document Repository</h1>
          <p>Upload, extract text, search, and manage legal contracts and court filings securely.</p>
        </div>
      </div>

      {/* Uploader Component */}
      <DocumentUploader onUploadSuccess={() => fetchDocuments()} />

      {/* Search & Filter Section */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '280px', display: 'flex', alignItems: 'center' }}>
            <div className="input-with-icon" style={{ width: '100%' }}>
              <Search className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Search documents by filename or extracted text keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <button
            onClick={() => fetchDocuments(searchQuery)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--panel-border)',
              color: 'var(--text-main)',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
          {['ALL', 'Contract', 'NDA', 'Court Brief', 'Court Order', 'Legal Opinion', 'General Legal Document'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--panel-border)',
                background: selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? 'var(--text-inverse)' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat === 'ALL' ? 'All Documents' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Library List */}
      {error && (
        <div className="error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="spinner-container" style={{ minHeight: '30vh' }}>
          <div className="spinner"></div>
          <p>Loading document library...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No Legal Documents Found</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {searchQuery ? `No files matching "${searchQuery}".` : 'Upload your first PDF, DOCX, or TXT file using the uploader above.'}
          </p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <FileText size={28} style={{ color: getFormatBadgeColor(doc.contentType) }} />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, wordBreak: 'break-word' }}>{doc.originalFilename}</h4>
                      <span className="role-tag" style={{ background: 'rgba(229, 185, 100, 0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(229, 185, 100, 0.3)', fontSize: '0.7rem' }}>
                        {doc.fileCategory}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {doc.extractedTextSnippet || 'No text extracted.'}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderTop: '1px solid var(--panel-border)', paddingTop: '0.75rem' }}>
                  <span>By: {doc.userFullName}</span>
                  <span>{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate(`/documents/${doc.id}/analysis`)}
                    style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(229,185,100,0.2) 0%, rgba(200,155,65,0.2) 100%)', color: 'var(--accent-gold)', border: '1px solid rgba(229,185,100,0.4)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    <Sparkles size={14} /> Analyze with AI
                  </button>

                  <button
                    onClick={() => setActiveModalDoc(doc)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.45rem', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-blue)', border: '1px solid rgba(56, 189, 248, 0.3)', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    <Eye size={14} /> View Details
                  </button>

                  <button
                    onClick={() => handleDownload(doc)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.45rem', borderRadius: 'var(--radius-sm)', background: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-green)', border: '1px solid rgba(52, 211, 153, 0.3)', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    <Download size={14} /> Download
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(248, 113, 113, 0.15)', color: 'var(--accent-red)', border: '1px solid rgba(248, 113, 113, 0.3)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Details Modal */}
      {activeModalDoc && (
        <DocumentDetailModal
          document={activeModalDoc}
          onClose={() => setActiveModalDoc(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};
