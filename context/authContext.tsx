// src/contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials, RegisterData, AuthResponse, ApiError } from '@/types';
import authService from '@/services/auth/authService';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
  isOwner: boolean;
  isRenter: boolean;
  isAdmin: boolean;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'AUTH_INIT'; payload: User | null };

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        initialized: true,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
        initialized: true,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        initialized: true,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_INIT':
      return {
        ...state,
        user: action.payload,
        initialized: true,
        loading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Initialize auth state on mount
 // In your AuthContext, ensure the initialization logic is correct
useEffect(() => {
  const initAuth = () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        dispatch({ type: 'AUTH_INIT', payload: user });
      } else {
        dispatch({ type: 'AUTH_INIT', payload: null });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      dispatch({ type: 'AUTH_INIT', payload: null });
    }
  };

  initAuth();
}, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response: AuthResponse = await authService.login(credentials);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      
      // Redirect based on user role
      if (response.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (response.user.role === 'OWNER') {
        router.push('/owner/dashboard');
      } else {
        router.push('/browse');
      }
    } catch (error: any) {
      const errorMessage = (error as ApiError).error || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

const register = async (userData: RegisterData): Promise<void> => {
  try {
    dispatch({ type: 'AUTH_START' });
    
    const response: AuthResponse = await authService.register(userData);
    
    dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    
    // Redirect based on user role
    if (response.user.role === 'OWNER') {
      router.push('/owner/dashboard');
    } else {
      router.push('/browse');
    }
  } catch (error: any) {
    const errorMessage = (error as ApiError).error || 'Registration failed';
    dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    throw error;
  }
};

  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
    router.push('/');
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!state.user,
    isOwner: state.user?.role === 'OWNER',
    isRenter: state.user?.role === 'RENTER',
    isAdmin: state.user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};