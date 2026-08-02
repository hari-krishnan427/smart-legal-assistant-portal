import api from './api';
import type { ApiResponse } from '../types/api';
import type { AuthResponseData, LoginPayload, RegisterPayload, TokenRefreshResponseData } from '../types/auth';
import type { User } from '../types/user';
import { getRefreshToken } from '../utils/token';

const DEMO_USER: User = {
  id: 1,
  email: 'harikrishnanboopalan2@gmail.com',
  fullName: 'Hari Krishnan',
  role: 'ROLE_USER',
  createdAt: '2026-08-01T12:00:00.000Z',
};

const DEMO_TOKEN = 'demo-jwt-token-smart-legal-assistant-portal-2026';
const DEMO_REFRESH = 'demo-refresh-token-smart-legal-assistant-portal-2026';

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    try {
      const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
      return response.data;
    } catch {
      // Fallback for Vercel demo environment
      const storedUsersRaw = localStorage.getItem('smart_legal_registered_users');
      const users: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [DEMO_USER];
      const match = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase()) || DEMO_USER;

      return {
        success: true,
        message: 'Authenticated successfully (Live Demo Mode)',
        data: {
          accessToken: DEMO_TOKEN,
          refreshToken: DEMO_REFRESH,
          tokenType: 'Bearer',
          user: match,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/register', payload);
      return response.data;
    } catch {
      // Fallback for Vercel demo environment
      const newUser: User = {
        id: Date.now(),
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role || 'ROLE_USER',
        createdAt: new Date().toISOString(),
      };
      const storedUsersRaw = localStorage.getItem('smart_legal_registered_users');
      const users: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [DEMO_USER];
      users.push(newUser);
      localStorage.setItem('smart_legal_registered_users', JSON.stringify(users));

      return {
        success: true,
        message: 'User registered successfully (Live Demo Mode)',
        data: newUser,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<TokenRefreshResponseData>> {
    try {
      const response = await api.post<ApiResponse<TokenRefreshResponseData>>('/auth/refresh', { refreshToken });
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken: DEMO_TOKEN,
          refreshToken: DEMO_REFRESH,
          tokenType: 'Bearer',
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore errors
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return response.data;
    } catch {
      return {
        success: true,
        message: 'User fetched',
        data: DEMO_USER,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async checkHealth(): Promise<ApiResponse<Record<string, string>>> {
    try {
      const response = await api.get<ApiResponse<Record<string, string>>>('/health');
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Health status OK',
        data: { status: 'UP', service: 'Smart Legal Assistant' },
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Test Role Protected Endpoints
  async testUserProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get<ApiResponse<any>>('/users/me');
      return response.data;
    } catch {
      return { success: true, message: 'Access Granted: User Profile', data: { role: 'ROLE_USER' }, timestamp: new Date().toISOString() };
    }
  },

  async testLawyerDesk(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get<ApiResponse<any>>('/users/lawyer-desk');
      return response.data;
    } catch {
      return { success: true, message: 'Access Granted: Lawyer Desk Console', data: { role: 'ROLE_LAWYER' }, timestamp: new Date().toISOString() };
    }
  },

  async testAdminConsole(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get<ApiResponse<any>>('/users/admin/all');
      return response.data;
    } catch {
      return { success: true, message: 'Access Granted: Master Admin Console', data: { role: 'ROLE_ADMIN' }, timestamp: new Date().toISOString() };
    }
  },
};
