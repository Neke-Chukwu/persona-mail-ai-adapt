# PersonaMail AI - Intelligent Email Assistant

PersonaMail AI is a smart, adaptive email client that personalizes communication, streamlines inbox management, and provides AI-powered insights. Built for the CustomHack hackathon with a focus on user-centric adaptation.

---

## ✅ Already Implemented

- **Gemini 2.0 Flash Integration**: AI-powered email replies, summarization, and pattern analysis.
- **Supabase Integration**: User data, categories, and preferences stored and managed.
- **Resend Integration**: Transactional email sending and daily digests.
- **Firecrawl Setup**: Service initialized for future web scraping and enrichment.
- **Autumn Pricing Integration**: Usage tracking and provider setup.
- **Tambo.co Integration**: Adaptive UI provider included in app root.
- **i18next/react-i18next**: Internationalization infrastructure in place.
- **Service Layer**: Centralized integration for all sponsor tools.
- **Debug/Tools Test UI**: Visual tool to check integration health.
- **Floating AI Assistant**: Gemini-powered assistant in the UI.
- **Responsive UI**: Tailwind, Shadcn UI, and responsive layout.
- **Core Email Components**: Email list, view, compose modal, sidebar scaffolded.
- **API Routes**: AI endpoints for reply, summarization, and category generation.

---

## 🚧 Yet To Be Done

- **Better Auth**: Implement real OAuth login flow (currently mocked).
- **Magic UI**: Integrate Magic UI components and animations for visual polish.
- **Firecrawl**: Deepen integration for application tracking and enrichment.
- **Autumn Pricing**: Add dynamic pricing UI and feature gating.
- **Gmail API**: Integrate for real email fetching and sending.
- **Cloudinary**: Add for asset uploads (profile photos, etc.).
- **Full API Route Coverage**: Implement endpoints for applications, feedback, daily digest, upload-asset, etc.
- **Analytics/Insights Dashboard**: Build productivity and usage analytics UI.
- **Application Tracking UI**: Complete tracked applications management and enrichment.
- **Adaptive UI Logic**: Use Tambo for context-aware layout and suggestions.
- **Polish & Testing**: End-to-end testing, bug fixes, and hackathon polish.

---

## 🚀 Features (Current & Planned)

- **AI-Powered Email Replies**: Generate contextual, personalized responses using Gemini 2.0 Flash
- **Smart Categorization**: Automatically organize emails with custom categories
- **Adaptive UI**: Dynamic interface that adjusts to user preferences and device types (Tambo)
- **Gmail Integration**: (Planned) Seamless connection with your existing Gmail account
- **Floating AI Assistant**: Quick access to AI features from anywhere in the app
- **Application Tracking**: Monitor job applications and important correspondences (UI in progress)
- **Urgency Detection**: AI-powered priority assessment for incoming emails
- **Responsive Design**: Perfect experience across all devices
- **Dynamic Pricing**: (Planned) Feature gating and usage tracking with Autumn
- **Magic UI Animations**: (Planned) Delightful micro-interactions and effects

## 🛠 Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn UI
- **Authentication**: Better Auth with Google OAuth (in progress)
- **AI/LLM**: Gemini 2.0 Flash for intelligent features
- **Database**: Supabase (PostgreSQL)
- **Email**: Gmail API integration (planned), Resend for transactional emails
- **Adaptive UI**: Tambo.co for dynamic interface adjustments
- **Animations**: Magic UI (planned)
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- A Gmail account for testing
- API keys for the services listed in the environment variables

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd personamail-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys and configuration values in `.env.local`.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Required API Keys & Setup

### Essential Services

1. **Better Auth** - For secure authentication
   - Create a project at Better Auth
   - Get your client ID and secret
   - Configure OAuth redirect URLs

2. **Gmail API** - For email integration
   - Enable Gmail API in Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

3. **Gemini API** - For AI features
   - Get API key from Google AI Studio
   - Enable Gemini 2.0 Flash model access

4. **Supabase** - For database and backend
   - Create a new Supabase project
   - Get your project URL and anon key
   - Set up the database schema (see below)

### Optional Services

5. **Tambo.co** - For adaptive UI
   ```bash
   npx tambo full-send
   ```

6. **Resend** - For sending emails
   - Sign up at Resend
   - Get your API key

7. **Cloudinary** - For file storage
   - Create account and get cloud name, API key, and secret

## 🗄 Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  default_tone_preference TEXT DEFAULT 'professional',
  role_profession TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email categories
CREATE TABLE email_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  keywords TEXT[],
  description TEXT,
  is_system_category BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User personas
CREATE TABLE user_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tone_description TEXT NOT NULL,
  example_phrases TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracked applications
CREATE TABLE tracked_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_id TEXT NOT NULL,
  category_id UUID REFERENCES email_categories(id),
  title TEXT NOT NULL,
  company_institution TEXT NOT NULL,
  status TEXT DEFAULT 'Applied',
  deadline DATE,
  relevant_link TEXT,
  notes TEXT,
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email metadata for AI learning
CREATE TABLE email_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_id TEXT NOT NULL,
  detected_category_id UUID REFERENCES email_categories(id),
  user_assigned_category_id UUID REFERENCES email_categories(id),
  detected_tone TEXT,
  user_selected_tone TEXT,
  user_edit_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Deployment

This project is configured for deployment on Vercel:

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Environment Variables**
   - Add all variables from `.env.example` to Vercel
   - Ensure `NEXT_PUBLIC_` prefixed variables are set correctly

3. **Deploy**
   - Push to your main branch
   - Vercel will automatically deploy

## 📱 Usage

### Getting Started
1. **Login**: Use your Gmail account to authenticate
2. **Initial Setup**: Configure your tone preferences and role
3. **Email Sync**: Allow the app to analyze your inbox

### Core Features
- **Email Management**: Browse emails with smart categorization
- **AI Replies**: Click "Reply" and let AI generate contextual responses
- **Floating Assistant**: Use the AI button for quick help and insights
- **Categories**: Organize emails with custom categories
- **Applications**: Track job applications and important deadlines

### AI Assistant
- **Quick Actions**: Summarize emails, extract action items
- **Smart Replies**: Generate personalized responses
- **Insights**: Get productivity tips and email analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CustomHack** for the inspiration and hackathon opportunity
- **Sponsor Tools**: Tambo.co, Better Auth, Magic UI, Autumn Pricing, Firecrawl
- **Google** for Gemini 2.0 Flash API
- **Supabase** for backend infrastructure

## 📞 Support

For support, email support@personamail.ai or join our Discord community.

---

Built with ❤️ for the CustomHack hackathon - *"Build software that fits every user"*

---

## 🏁 Next Steps Prompt

Copy and paste the prompt below to get a tailored next-steps plan for PersonaMail AI:

```
Hey Cursor, here is my current PersonaMail AI progress (see README). Please generate a prioritized roadmap and code pointers for the next features to implement, focusing on hackathon impact and sponsor tool integration.
```

---
