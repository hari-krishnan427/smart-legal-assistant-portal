import api from './api';
import type { ApiResponse } from '../types/api';
import type { AuthResponseData, LoginPayload, RegisterPayload, TokenRefreshResponseData } from '../types/auth';
import type { User } from '../types/user';
import { getRefreshToken } from '../utils/token';

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>('/auth/register', payload);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<TokenRefreshResponseData>> {
    const response = await api.post<ApiResponse<TokenRefreshResponseData>>('/auth/refresh', { refreshToken });
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore errors during logout
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  async checkHealth(): Promise<ApiResponse<Record<string, string>>> {
    const response = await api.get<ApiResponse<Record<string, string>>>('/health');
    return response.data;
  },

  // Test Role Protected Endpoints
  async testUserProfile(): Promise<ApiResponse<any>> {
    const response = await api.get<ApiResponse<any>>('/users/me');
    return response.data;
  },

  async testLawyerDesk(): Promise<ApiResponse<any>> {
    const response = await api.get<ApiResponse<any>>('/users/lawyer-desk');
    return response.data;
  },

  async testAdminConsole(): Promise<ApiResponse<any>> {
    const response = await api.get<ApiResponse<any>>('/users/admin/all');
    return response.data;
  },
};
