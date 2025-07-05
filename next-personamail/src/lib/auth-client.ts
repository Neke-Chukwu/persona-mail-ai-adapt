import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
});

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Auth client initialized with baseURL:', process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000");
}
