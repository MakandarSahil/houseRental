// src/components/auth/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'OWNER' | 'RENTER' | 'ADMIN';
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/' 
}) => {
  const { isAuthenticated, user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return; // Wait for auth to initialize

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push(fallbackPath);
    }
  }, [isAuthenticated, user, requiredRole, initialized, router, fallbackPath]);

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated or wrong role
  // The useEffect will handle the redirect
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

// Specific protected route components for different roles
export const OwnerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="OWNER" fallbackPath="/">
    {children}
  </ProtectedRoute>
);

export const RenterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="RENTER" fallbackPath="/browse">
    {children}
  </ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="ADMIN" fallbackPath="/">
    {children}
  </ProtectedRoute>
);