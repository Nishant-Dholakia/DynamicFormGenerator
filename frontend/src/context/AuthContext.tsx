import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import apiClient from '../api/client';
import { UserDto } from '../types';

interface AuthState {
  isLoggedIn: boolean;
  user: UserDto | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: Record<string, string>) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });

  const verifyAuth = async () => {
    try {
      const verifyRes = await apiClient.get<boolean>('/auth/verify');
      
      if (verifyRes.data) {
        const userRes = await apiClient.get<UserDto>('/auth/user');
        setAuth({
          isLoggedIn: true,
          user: userRes.data,
          isLoading: false,
        });
      } else {
        setAuth({ isLoggedIn: false, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to verify auth session:', error);
      setAuth({ isLoggedIn: false, user: null, isLoading: false });
    }
  };

  // Check auth status on initial load
  useEffect(() => {
    verifyAuth();
  }, []);

  const login = async (credentials: Record<string, string>): Promise<boolean> => {
    try {
      setAuth((prev) => ({ ...prev, isLoading: true }));
      
      // 1. Send login credentials (sets HTTP-only cookie on success)
      await apiClient.post('/auth/login', credentials);

      // Add a tiny delay to allow cookie propagation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 2. Fetch the user details
      const userResponse = await apiClient.get<UserDto>('/auth/user');
      
      setAuth({
        isLoggedIn: true,
        user: userResponse.data,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuth({ isLoggedIn: false, user: null, isLoading: false });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      // Always clear local session even if backend call fails
      setAuth({ isLoggedIn: false, user: null, isLoading: false });
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, refreshUser: verifyAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
