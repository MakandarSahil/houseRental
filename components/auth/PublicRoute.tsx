// src/components/auth/PublicRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectPath = '/browse' 
}) => {
  const { isAuthenticated, user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized || loading) return;

    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'OWNER') {
        router.push('/owner/dashboard');
      } else {
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, user, loading, initialized, router, redirectPath]);

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};