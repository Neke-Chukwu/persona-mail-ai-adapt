
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['better-auth'],
  },
  transpilePackages: ['lucide-react', 'autumn-js'],
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    AUTUMN_API_KEY: process.env.AUTUMN_API_KEY,
    NEXT_PUBLIC_TAMBO_API_KEY: process.env.NEXT_PUBLIC_TAMBO_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  }
};

module.exports = nextConfig;
