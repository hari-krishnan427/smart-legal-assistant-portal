export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'smart_legal_token',
  USER_DATA: 'smart_legal_user',
} as const;
