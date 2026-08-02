import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, LoginPayload, RegisterPayload } from '../types/auth';
import type { User } from '../types/user';
import { authService } from '../services/authService';
import { getAccessToken, removeTokens, setTokens } from '../utils/token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = getAccessToken();
      if (storedAccessToken) {
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            handleLogout();
          }
        } catch {
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        setTokens(accessToken, refreshToken);
        setToken(accessToken);
        setUser(userData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      await authService.register(payload);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      removeTokens();
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
