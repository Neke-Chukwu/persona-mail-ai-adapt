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

  // Only render providers if environment variables are available
  const tamboApiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  const autumnBackendUrl = process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL;

  // Debug logging
  console.log('Environment variables:', {
    tamboApiKey: tamboApiKey ? 'set' : 'not set',
    autumnBackendUrl: autumnBackendUrl || 'not set'
  });

  return (
    <QueryClientProvider client={queryClient}>
      {tamboApiKey && (
        <TamboProvider apiKey={tamboApiKey}>
          {autumnBackendUrl && autumnBackendUrl !== 'your_autumn_backend_url_here' ? (
            <AutumnProvider backendUrl={autumnBackendUrl}>
              {children}
            </AutumnProvider>
          ) : (
            children
          )}
        </TamboProvider>
      )}
      {!tamboApiKey && (
        autumnBackendUrl && autumnBackendUrl !== 'your_autumn_backend_url_here' ? (
          <AutumnProvider backendUrl={autumnBackendUrl}>
            {children}
          </AutumnProvider>
        ) : (
          children
        )
      )}
    </QueryClientProvider>
  );
}
