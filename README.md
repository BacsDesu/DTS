# DTS - Document Tracking System

A modern Document Tracking System built with Next.js and Supabase.

## Features

- User authentication with Supabase
- Create, read, update, and delete documents
- Track document status and routing
- User-friendly dashboard
- Row Level Security (RLS) for data protection

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dts
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`: Your local development callback URL

4. Set up the Supabase database:
   - Go to your Supabase project
   - Open the SQL editor
   - Run the following SQL to create tables:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  department TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create logs table
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  document_date DATE NOT NULL,
  document_type TEXT NOT NULL,
  classification TEXT,
  subject TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create routed_logs table
CREATE TABLE IF NOT EXISTS public.routed_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID NOT NULL REFERENCES public.logs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routed_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own logs" ON public.logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON public.logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON public.logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view routed logs for their documents" ON public.routed_logs FOR SELECT USING (
  log_id IN (SELECT id FROM public.logs WHERE user_id = auth.uid()) OR user_id = auth.uid()
);
CREATE POLICY "Users can insert routed logs" ON public.routed_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
```

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  auth/
    callback/route.ts       # OAuth callback handler
    login/page.tsx          # Login page
    sign-up/page.tsx        # Sign up page
    error/page.tsx          # Auth error page
  dashboard/
    page.tsx                # Main dashboard
  layout.tsx                # Root layout
  page.tsx                  # Home redirect
  globals.css               # Global styles

components/
  header.tsx                # Header with user info and logout
  document-form.tsx         # Form to add new documents
  document-list.tsx         # Table of documents
  document-detail.tsx       # Document details modal

lib/supabase/
  client.ts                 # Client-side Supabase client
  server.ts                 # Server-side Supabase client
  proxy.ts                  # Proxy handler for session management
```

## Features

### Authentication
- Sign up with email and password
- Login with email and password
- Secure session management with Supabase
- Automatic token refresh

### Document Management
- Create new documents
- View all your documents
- Update document status
- Delete documents
- View document details in a modal

### Security
- Row Level Security (RLS) policies
- User data isolation
- Secure authentication with Supabase
- Protected routes

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

## Support

For issues or questions, please open an issue in the repository.
