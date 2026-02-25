'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import NoSSR from './NoSSR';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <NoSSR>
        <div className="min-h-screen flex items-center justify-center bg-gray-50" suppressHydrationWarning={true}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" suppressHydrationWarning={true}></div>
        </div>
      </NoSSR>
    );
  }

  if (!user) {
    return (
      <NoSSR>
        <div className="min-h-screen flex items-center justify-center bg-gray-50" suppressHydrationWarning={true}>
          <div className="text-center">
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </NoSSR>
    );
  }

  return <NoSSR>{children}</NoSSR>;
}
