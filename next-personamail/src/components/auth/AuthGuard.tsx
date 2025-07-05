'use client';

import { useState, useEffect } from "react";
import { LoginScreen } from "./LoginScreen";
import { authClient } from "@/lib/auth-client";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For development, skip auth check if API is not available
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: skipping auth check');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        const session = await authClient.getSession();
        setIsAuthenticated(!!session?.data?.user);
      } catch (e) {
        console.log('Auth check failed:', e);
        // In development, allow access even if auth fails
        if (process.env.NODE_ENV === 'development') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <>{children}</>;
};
