export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-legal-assistant-portal.onrender.com/api/v1';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'smart_legal_token',
  USER_DATA: 'smart_legal_user',
} as const;
