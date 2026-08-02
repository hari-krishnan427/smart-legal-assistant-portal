import api from './api';
import type { ApiResponse } from '../types/api';
import type { AiAnalysisResponse, AiDashboardStats, ChatRequest, ChatResponse } from '../types/ai';

export const aiService = {
  async analyzeDocument(documentId: number): Promise<ApiResponse<AiAnalysisResponse>> {
    const response = await api.post<ApiResponse<AiAnalysisResponse>>(`/ai/analyze/${documentId}`);
    return response.data;
  },

  async getAnalysisResult(documentId: number): Promise<ApiResponse<AiAnalysisResponse>> {
    const response = await api.get<ApiResponse<AiAnalysisResponse>>(`/ai/result/${documentId}`);
    return response.data;
  },

  async chatWithDocument(documentId: number, payload: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    const response = await api.post<ApiResponse<ChatResponse>>(`/ai/chat/${documentId}`, payload);
    return response.data;
  },

  async getDashboardStats(): Promise<ApiResponse<AiDashboardStats>> {
    const response = await api.get<ApiResponse<AiDashboardStats>>('/ai/dashboard-stats');
    return response.data;
  },
};
