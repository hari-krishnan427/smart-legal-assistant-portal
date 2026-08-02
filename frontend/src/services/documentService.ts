import api from './api';
import type { ApiResponse } from '../types/api';
import type { LegalDocument } from '../types/document';

export const documentService = {
  async uploadDocument(
    file: File,
    category: string,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<LegalDocument>> {
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
  },

  async getDocuments(searchQuery?: string): Promise<ApiResponse<LegalDocument[]>> {
    const params = searchQuery ? { q: searchQuery } : {};
    const response = await api.get<ApiResponse<LegalDocument[]>>('/documents', { params });
    return response.data;
  },

  async getDocumentById(id: number): Promise<ApiResponse<LegalDocument>> {
    const response = await api.get<ApiResponse<LegalDocument>>(`/documents/${id}`);
    return response.data;
  },

  async downloadDocument(id: number, originalFilename: string): Promise<void> {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', originalFilename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async deleteDocument(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/documents/${id}`);
    return response.data;
  },
};
