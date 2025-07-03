
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamboProvider } from '@tambo-ai/react';
import { AutumnProvider } from 'autumn-js/react';
import App from './App.tsx';
import './index.css';
import './i18n/config';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TamboProvider apiKey={import.meta.env.VITE_TAMBO_API_KEY}>
      <AutumnProvider backendUrl={import.meta.env.VITE_AUTUMN_BACKEND_URL}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AutumnProvider>
    </TamboProvider>
  </QueryClientProvider>
);
