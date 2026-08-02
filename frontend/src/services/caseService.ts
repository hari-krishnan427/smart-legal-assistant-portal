import api from './api';
import type { ApiResponse } from '../types/api';
import type {
  CaseResponse,
  CaseNoteResponse,
  CreateCaseRequest,
  UpdateCaseRequest,
  CreateCaseNoteRequest,
  CaseStatus,
} from '../types/case';

export const caseService = {
  async getCases(query?: string, status?: CaseStatus): Promise<ApiResponse<CaseResponse[]>> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status) params.append('status', status);

    const response = await api.get<ApiResponse<CaseResponse[]>>(`/cases?${params.toString()}`);
    return response.data;
  },

  async getCaseById(id: number): Promise<ApiResponse<CaseResponse>> {
    const response = await api.get<ApiResponse<CaseResponse>>(`/cases/${id}`);
    return response.data;
  },

  async createCase(payload: CreateCaseRequest): Promise<ApiResponse<CaseResponse>> {
    const response = await api.post<ApiResponse<CaseResponse>>('/cases', payload);
    return response.data;
  },

  async updateCase(id: number, payload: UpdateCaseRequest): Promise<ApiResponse<CaseResponse>> {
    const response = await api.put<ApiResponse<CaseResponse>>(`/cases/${id}`, payload);
    return response.data;
  },

  async deleteCase(id: number): Promise<ApiResponse<string>> {
    const response = await api.delete<ApiResponse<string>>(`/cases/${id}`);
    return response.data;
  },

  async addNote(caseId: number, payload: CreateCaseNoteRequest): Promise<ApiResponse<CaseNoteResponse>> {
    const response = await api.post<ApiResponse<CaseNoteResponse>>(`/cases/${caseId}/notes`, payload);
    return response.data;
  },

  async getNotes(caseId: number): Promise<ApiResponse<CaseNoteResponse[]>> {
    const response = await api.get<ApiResponse<CaseNoteResponse[]>>(`/cases/${caseId}/notes`);
    return response.data;
  },

  async linkDocument(caseId: number, documentId: number): Promise<ApiResponse<CaseResponse>> {
    const response = await api.post<ApiResponse<CaseResponse>>(`/cases/${caseId}/link-document/${documentId}`);
    return response.data;
  },
};
