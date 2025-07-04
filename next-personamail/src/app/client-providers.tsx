
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamboProvider } from '@tambo-ai/react';
import { AutumnProvider } from 'autumn-js/react';
import { useState } from 'react';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ''}>
        <AutumnProvider backendUrl={process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL || ''}>
          {children}
        </AutumnProvider>
      </TamboProvider>
    </QueryClientProvider>
  );
}
