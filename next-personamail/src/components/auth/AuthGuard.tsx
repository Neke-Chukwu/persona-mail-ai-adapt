
'use client';

import { useSession } from "@/lib/auth-client";
import { LoginScreen } from "./LoginScreen";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { data: session, isPending } = useSession();

  console.log('Checking authentication status...');
  console.log('Session:', session);
  console.log('Is pending:', isPending);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    console.log('No valid session found');
    return <LoginScreen />;
  }

  console.log('User authenticated:', session.user);
  return <>{children}</>;
};
