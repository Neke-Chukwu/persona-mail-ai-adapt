
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamboProvider } from '@tambo-ai/react';
import { AutumnProvider } from 'autumn-js/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ClientProviders from "./client-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PersonaMail AI",
  description: "Your intelligent email assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <TooltipProvider>
            <ThemeProvider>
              <Toaster />
              <Sonner />
              {children}
            </ThemeProvider>
          </TooltipProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
