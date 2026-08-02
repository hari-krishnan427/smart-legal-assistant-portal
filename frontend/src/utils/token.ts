import { STORAGE_KEYS } from './constants';

export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('smart_legal_refresh_token');
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
  if (refreshToken) {
    localStorage.setItem('smart_legal_refresh_token', refreshToken);
  }
};

export const removeTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem('smart_legal_refresh_token');
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};
