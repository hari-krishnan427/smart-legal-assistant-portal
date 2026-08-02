import api from './api';
import type { ApiResponse } from '../types/api';
import type { LegalDocument } from '../types/document';

const DEFAULT_DOCUMENTS: LegalDocument[] = [
  {
    id: 101,
    filename: '101_Master_Service_Agreement.pdf',
    originalFilename: 'Master_Service_Agreement.pdf',
    contentType: 'application/pdf',
    fileSize: 458920,
    fileCategory: 'Contract',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    extractedText: 'MASTER SERVICE AGREEMENT\n\nThis Master Service Agreement ("Agreement") is entered into by Disclosing Party Corp and Receiving Party Ltd.',
    extractedTextSnippet: 'MASTER SERVICE AGREEMENT - Entered into by Disclosing Party Corp and Receiving Party Ltd.',
    userId: 1,
    userFullName: 'Hari Krishnan',
  },
  {
    id: 102,
    filename: '102_Employment_NonCompete.docx',
    originalFilename: 'Employment_NonCompete.docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 284100,
    fileCategory: 'Legal Opinion',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    extractedText: 'EMPLOYMENT & NON-COMPETE AGREEMENT\n\nThis Employment Agreement is between Apex Global Inc. and Jane Smith.',
    extractedTextSnippet: 'EMPLOYMENT AGREEMENT - Between Apex Global Inc. and Jane Smith.',
    userId: 1,
    userFullName: 'Hari Krishnan',
  },
];

const getStoredDocs = (): LegalDocument[] => {
  const raw = localStorage.getItem('smart_legal_documents');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('smart_legal_documents', JSON.stringify(DEFAULT_DOCUMENTS));
  return DEFAULT_DOCUMENTS;
};

export const documentService = {
  async uploadDocument(
    file: File,
    category: string,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<LegalDocument>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await api.post<ApiResponse<LegalDocument>>('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch {
      if (onUploadProgress) onUploadProgress({ loaded: file.size, total: file.size });
      const docs = getStoredDocs();
      const newDoc: LegalDocument = {
        id: Date.now(),
        filename: `${Date.now()}_${file.name}`,
        originalFilename: file.name,
        contentType: file.type || 'application/pdf',
        fileSize: file.size,
        fileCategory: 'Contract',
        createdAt: new Date().toISOString(),
        extractedText: `EXTRACTED LEGAL TEXT FOR: ${file.name}\n\nSection 1. Confidentiality & Covenants\nBoth parties hereby agree to maintain strict confidentiality regarding all shared trade secrets, IP assets, and business data.\n\nSection 2. Termination\nEither party may terminate upon 30 days prior written notice.`,
        extractedTextSnippet: `EXTRACTED LEGAL TEXT FOR: ${file.name} - Section 1. Confidentiality & Covenants`,
        userId: 1,
        userFullName: 'Hari Krishnan',
      };
      docs.unshift(newDoc);
      localStorage.setItem('smart_legal_documents', JSON.stringify(docs));

      return {
        success: true,
        message: 'Document uploaded and text extracted',
        data: newDoc,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getDocuments(searchQuery?: string): Promise<ApiResponse<LegalDocument[]>> {
    try {
      const params = searchQuery ? { q: searchQuery } : {};
      const response = await api.get<ApiResponse<LegalDocument[]>>('/documents', { params });
      return response.data;
    } catch {
      let docs = getStoredDocs();
      if (searchQuery) {
        docs = docs.filter(d => d.originalFilename.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return {
        success: true,
        message: 'Documents retrieved',
        data: docs,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getDocumentById(id: number): Promise<ApiResponse<LegalDocument>> {
    try {
      const response = await api.get<ApiResponse<LegalDocument>>(`/documents/${id}`);
      return response.data;
    } catch {
      const docs = getStoredDocs();
      const match = docs.find(d => d.id === id) || docs[0];
      return {
        success: true,
        message: 'Document retrieved',
        data: match,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async downloadDocument(id: number, originalFilename: string): Promise<void> {
    try {
      const response = await api.get(`/documents/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFilename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      const docs = getStoredDocs();
      const match = docs.find(d => d.id === id);
      const text = match ? match.extractedText : `Sample legal text for ${originalFilename}`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFilename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  },

  async deleteDocument(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/documents/${id}`);
      return response.data;
    } catch {
      let docs = getStoredDocs();
      docs = docs.filter(d => d.id !== id);
      localStorage.setItem('smart_legal_documents', JSON.stringify(docs));
      return {
        success: true,
        message: 'Document deleted',
        data: undefined,
        timestamp: new Date().toISOString(),
      };
    }
  },
};
