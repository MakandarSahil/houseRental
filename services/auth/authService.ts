// src/services/auth/authService.ts
import { User, LoginCredentials, RegisterData, AuthResponse, ApiError } from '@/types';
import api from '../api';

class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const data = response.data;
      
      // Store token and user data
      this.setToken(data.token);
      this.setUser(data.user);
      
      return data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      const data = response.data;
      
      // Store token and user data
      this.setToken(data.token);
      this.setUser(data.user);
      
      return data;
    } catch (error: any) {
      throw error.response?.data as ApiError || error;
    }
  }

  logout(): void {
    // Clear stored data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) {
        return JSON.parse(userStr) as User;
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      this.logout(); // Clear corrupted data
    }
    
    return null;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  // Optional: Method to refresh token if needed
  async refreshToken(): Promise<string> {
    try {
      const response = await api.post<{ token: string }>('/auth/refresh');
      const newToken = response.data.token;
      this.setToken(newToken);
      return newToken;
    } catch (error: any) {
      this.logout();
      throw error.response?.data as ApiError || error;
    }
  }
}

export default new AuthService();