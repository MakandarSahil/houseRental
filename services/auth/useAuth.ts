// src/hooks/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthResponse, LoginCredentials, RegisterData, ApiError } from '@/types';
import authService from './authService';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: () => boolean;
  isOwner: () => boolean;
  isRenter: () => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = (err as ApiError).error || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  const isAuthenticated = (): boolean => {
    return !!user;
  };

  const isOwner = (): boolean => {
    return user?.role === 'OWNER';
  };

  const isRenter = (): boolean => {
    return user?.role === 'RENTER';
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
    isOwner,
    isRenter,
  };
};