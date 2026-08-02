import React, { useState, useRef } from 'react';
import type { LegalDocumentCategory, UploadProgress } from '../../types/document';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

interface DocumentUploaderProps {
  onUploadSuccess: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<LegalDocumentCategory>('Contract');
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    filename: '',
    status: 'idle',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const filename = file.name.toLowerCase();
    const isValidExtension = validExtensions.some((ext) => filename.endsWith(ext));

    if (!isValidExtension) {
      setProgress({
        percentage: 0,
        filename: file.name,
        status: 'error',
        errorMessage: 'Invalid file type. Only PDF, DOCX, and TXT files are supported.',
      });
      return false;
    }

    if (file.size > 20 * 1024 * 1024) {
      // 20MB limit
      setProgress({
        percentage: 0,
        filename: file.name,
        status: 'error',
        errorMessage: 'File size exceeds maximum 20MB limit.',
      });
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setProgress({ percentage: 0, filename: file.name, status: 'idle' });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setProgress({ percentage: 0, filename: file.name, status: 'idle' });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const { documentService } = await import('../../services/documentService');

    setProgress({
      percentage: 10,
      filename: selectedFile.name,
      status: 'uploading',
    });

    try {
      const response = await documentService.uploadDocument(selectedFile, category, (event) => {
        if (event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress({
            percentage: Math.min(percent, 90),
            filename: selectedFile.name,
            status: percent >= 100 ? 'processing' : 'uploading',
          });
        }
      });

      if (response.success) {
        setProgress({
          percentage: 100,
          filename: selectedFile.name,
          status: 'success',
        });
        setSelectedFile(null);
        onUploadSuccess();
      }
    } catch (err: any) {
      setProgress({
        percentage: 0,
        filename: selectedFile.name,
        status: 'error',
        errorMessage: err.response?.data?.message || 'Upload failed. Ensure backend server is active.',
      });
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UploadCloud size={24} style={{ color: 'var(--accent-gold)' }} />
        <span>Smart Document Uploader</span>
      </h3>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent-gold)' : 'var(--panel-border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          background: dragActive ? 'rgba(229, 185, 100, 0.08)' : 'rgba(13, 17, 23, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', background: 'rgba(229, 185, 100, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
          <FileText size={26} />
        </div>

        <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.35rem' }}>
          Drag & Drop your legal file here, or <span style={{ color: 'var(--accent-gold)' }}>Browse</span>
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Supported Formats: <strong>PDF, DOCX, TXT</strong> (Max Size: 20MB)
        </p>
      </div>

      {selectedFile && (
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={22} style={{ color: 'var(--accent-blue)' }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{selectedFile.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LegalDocumentCategory)}
                style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', background: '#0d1117', color: 'var(--text-main)', border: '1px solid var(--panel-border)', fontSize: '0.85rem' }}
              >
                <option value="Contract">Contract</option>
                <option value="NDA">NDA</option>
                <option value="Court Brief">Court Brief</option>
                <option value="Court Order">Court Order</option>
                <option value="Legal Opinion">Legal Opinion</option>
                <option value="General Legal Document">General Document</option>
              </select>

              <button
                onClick={handleUpload}
                disabled={progress.status === 'uploading' || progress.status === 'processing'}
                className="btn-primary"
              >
                {progress.status === 'uploading' || progress.status === 'processing' ? (
                  <>
                    <Loader2 size={16} className="spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Upload & Extract</span>
                )}
              </button>

              <button
                onClick={() => setSelectedFile(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {progress.status !== 'idle' && (
        <div style={{ marginTop: '1rem' }}>
          {(progress.status === 'uploading' || progress.status === 'processing') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                <span>{progress.status === 'processing' ? 'Extracting text using PDFBox/POI...' : 'Uploading file...'}</span>
                <span>{progress.percentage}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress.percentage}%`, height: '100%', background: 'var(--accent-gold)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
          )}

          {progress.status === 'success' && (
            <div className="success-alert" style={{ margin: 0 }}>
              <CheckCircle size={18} />
              <span>Document uploaded and text extracted successfully!</span>
            </div>
          )}

          {progress.status === 'error' && (
            <div className="error-alert" style={{ margin: 0 }}>
              <AlertCircle size={18} />
              <span>{progress.errorMessage || 'Failed to upload document.'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
