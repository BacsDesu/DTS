# DTS Setup Guide

This guide will help you set up the Document Tracking System (DTS) with Supabase.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create an account
4. Create a new project:
   - Give it a name (e.g., "DTS")
   - Create a strong database password
   - Choose your region
   - Click "Create new project"

## Step 2: Get Your Credentials

1. Once your project is created, go to "Project Settings" (gear icon at bottom)
2. Click on the "API" tab
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Set Up Database Tables

1. In your Supabase project, go to the **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents from `scripts/database-setup.sql`
4. Paste it into the SQL editor
5. Click **"Run"** or press `Cmd/Ctrl + Enter`
6. Wait for the tables to be created successfully

## Step 4: Configure Environment Variables

1. In your project root, create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

   Replace the values with your actual Supabase credentials from Step 2.

## Step 5: Install Dependencies and Run

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Create Your First Account

1. Click "Sign Up" on the login page
2. Enter an email and password
3. Click "Sign Up"
4. You'll be redirected to verify your email (check your inbox)
5. Once verified, you can log in

## Step 7: Start Using DTS

1. Log in with your credentials
2. Go to the Dashboard
3. Use the "Add Document" form to create your first document
4. View, edit, and manage your documents

## Deploying to Vercel

### Option 1: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables when prompted
```

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is required"
- Make sure you've created `.env.local` file
- Check that the values are correctly copied from Supabase
- Restart the dev server after adding env variables

### "User signup failed"
- Make sure Supabase email confirmation is enabled
- Check your email for confirmation link
- If not received, check spam folder

### Database tables not created
- Make sure you ran the SQL script in Supabase SQL Editor
- Check that no errors appeared when running the script
- Verify in "Table Editor" that tables exist

### "Cannot find module" errors
- Delete `node_modules` folder
- Run `npm install` again
- Restart dev server

## Project Structure

```
DTS/
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Main dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (redirects)
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── header.tsx
│   ├── document-form.tsx
│   ├── document-list.tsx
│   └── document-detail.tsx
├── lib/supabase/           # Supabase configuration
│   ├── client.ts           # Browser client
│   ├── server.ts           # Server client
│   └── proxy.ts            # Middleware proxy
├── scripts/                 # Database setup scripts
│   └── database-setup.sql  # SQL to create tables
├── .env.example            # Example environment variables
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind configuration
└── next.config.js          # Next.js configuration
```

## Features Overview

### Authentication
- Email/password signup and login
- Secure session management
- Automatic token refresh
- Protected routes

### Document Management
- Create new documents with details
- View all your documents in a table
- See document status (pending, in progress, completed)
- View full details in a modal
- Delete documents with confirmation

### Security
- Row Level Security (RLS) policies
- User data isolation
- Protected API endpoints
- Secure password handling

## Next Steps

1. Customize the dashboard with your branding
2. Add more document fields if needed
3. Implement document search and filtering
4. Add user roles (admin, viewer, etc.)
5. Set up automated email notifications

## Support

- Check the README.md for more information
- Visit [Supabase Docs](https://supabase.com/docs)
- Check [Next.js Docs](https://nextjs.org/docs)
