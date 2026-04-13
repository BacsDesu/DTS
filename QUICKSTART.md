# Quick Start Guide

Get DTS running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- A Supabase account (free at supabase.com)

## Step 1: Get Supabase Credentials (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create/sign in to your account
2. Create a new project
3. In **Settings → API**:
   - Copy **Project URL** 
   - Copy **anon public** key

## Step 2: Set Up Environment (30 seconds)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<paste Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste anon key>
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

## Step 3: Create Database Tables (1 minute)

1. In Supabase, go to **SQL Editor**
2. Click **"New query"**
3. Copy-paste all of `scripts/database-setup.sql`
4. Click **Run**

## Step 4: Install & Run (1 minute)

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## Step 5: Sign Up & Start Using

1. Click **"Sign Up"**
2. Enter email & password
3. Check email for verification link
4. Log in
5. Add your first document!

## Common Issues

| Problem | Solution |
|---------|----------|
| "Can't find module" | Run `npm install` again |
| "Environment variables missing" | Restart dev server after adding `.env.local` |
| "Auth failing" | Check Supabase credentials are correct |
| "No tables" | Make sure you ran the SQL script |

## What's Next?

- Read **README.md** for full feature list
- Check **SETUP.md** for detailed instructions
- See **MIGRATION.md** for what changed from PHP
- Deploy to Vercel: `vercel deploy`

## File Locations

| What | Where |
|------|-------|
| Auth pages | `app/auth/` |
| Dashboard | `app/dashboard/` |
| Components | `components/` |
| Database config | `lib/supabase/` |
| Styles | `app/globals.css` |
| Database setup | `scripts/database-setup.sql` |

## Tips

✅ Keep `.env.local` secure - never commit it
✅ Test locally before deploying
✅ Enable email confirmation in Supabase for production
✅ Use RLS policies for security (already configured)

## Need Help?

1. Check the error message in the browser console
2. Read the README.md
3. Check Supabase docs: supabase.com/docs
4. Open an issue on GitHub

---

**You're all set!** Happy tracking! 📄
