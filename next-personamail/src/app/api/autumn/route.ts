
import { autumnHandler } from 'autumn-js/next';
import { NextRequest } from 'next/server';

interface AuthResult {
  userId: string;
  customerId?: string;
}

export const { GET, POST } = autumnHandler({
  identify: async (request: NextRequest): Promise<AuthResult> => {
    // For now, return a mock user ID
    // In production, extract user ID from your auth system
    return {
      userId: 'user_123',
      customerId: 'customer_123'
    };
  },
  secretKey: process.env.AUTUMN_API_KEY,
});
