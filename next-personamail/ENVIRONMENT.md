# Environment Setup

To run this Next.js app properly, you need to set up environment variables.

## Required Environment Variables

Create a `.env.local` file in the `next-personamail` directory with the following variables:

```bash
# Authentication
BETTER_AUTH_SECRET=your_better_auth_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
AUTUMN_API_KEY=your_autumn_api_key_here
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here
NEXT_PUBLIC_AUTUMN_BACKEND_URL=http://localhost:3001

# Database
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Email
RESEND_API_KEY=your_resend_api_key_here

# Web Scraping
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

## For Development (Optional)

If you don't have all the API keys, the app will still run but some features won't work:

- AI features will be disabled
- Authentication will show errors
- Email functionality won't work

## Quick Start

1. Copy the environment variables above
2. Create `.env.local` file in `next-personamail/` directory
3. Replace placeholder values with your actual API keys
4. Run `pnpm dev`

The app will work without all environment variables, but with limited functionality. 