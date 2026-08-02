import React, { useState } from 'react';
import type { LegalDocument } from '../../types/document';
import { X, Download, Copy, Check, FileText, User, Calendar, Tag, FileType } from 'lucide-react';

interface DocumentDetailModalProps {
  document: LegalDocument | null;
  onClose: () => void;
  onDownload: (doc: LegalDocument) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyText = () => {
    if (document.extractedText) {
      navigator.clipboard.writeText(document.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--panel-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(13, 17, 23, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={24} style={{ color: 'var(--accent-gold)' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{document.originalFilename}</h3>
              <span className="role-tag" style={{ background: 'rgba(229, 185, 100, 0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(229, 185, 100, 0.3)' }}>
                {document.fileCategory}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--panel-border)',
              fontSize: '0.875rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileType size={14} /> Format & Size:
              </span>
              <strong style={{ color: 'var(--text-main)' }}>
                {document.contentType.split('/')[1]?.toUpperCase() || 'FILE'} ({(document.fileSize / (1024 * 1024)).toFixed(2)} MB)
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} /> Uploaded By:
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{document.userFullName}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} /> Date Uploaded:
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{formatDate(document.createdAt)}</strong>
            </div>
          </div>

          {/* Extracted Text Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={16} style={{ color: 'var(--accent-blue)' }} />
                Extracted Document Text
              </h4>

              <button
                onClick={handleCopyText}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text-main)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={14} style={{ color: 'var(--accent-green)' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <div
              style={{
                background: '#0a0d12',
                border: '1px solid var(--panel-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                maxHeight: '320px',
                overflowY: 'auto',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                color: '#d1d5db',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
              }}
            >
              {document.extractedText || 'No text content could be extracted from this document.'}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--panel-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            background: 'rgba(13, 17, 23, 0.6)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--panel-border)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Close
          </button>
          <button
            onClick={() => onDownload(document)}
            className="btn-primary"
          >
            <Download size={16} />
            <span>Download Original File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
