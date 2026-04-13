# DTS Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Next.js App Router                                    │    │
│  │  ├── app/page.tsx (home)                               │    │
│  │  ├── app/auth/ (login, signup, callback)               │    │
│  │  └── app/dashboard/page.tsx (main app)                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  React Components                                       │    │
│  │  ├── Header (with logout)                              │    │
│  │  ├── DocumentForm (add document)                        │    │
│  │  ├── DocumentList (table view)                          │    │
│  │  └── DocumentDetail (modal)                             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    HTTP/HTTPS (REST API)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              Vercel (Deployment Platform)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Next.js Server                                         │    │
│  │  ├── middleware.ts (auth check)                         │    │
│  │  ├── lib/supabase/proxy.ts (session management)        │    │
│  │  └── app/auth/callback/route.ts (OAuth handler)        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                   Supabase Client SDK
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│            Supabase (Backend as a Service)                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Authentication (auth.users table)                      │    │
│  │  ├── Sign up / Sign in                                  │    │
│  │  ├── Email verification                                 │    │
│  │  ├── Token management (JWT)                             │    │
│  │  └── Session handling                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  PostgreSQL Database                                    │    │
│  │  ├── public.profiles (user data)                        │    │
│  │  ├── public.logs (documents)                            │    │
│  │  └── public.routed_logs (audit trail)                   │    │
│  │                                                         │    │
│  │  Security:                                              │    │
│  │  ├── Row Level Security (RLS) policies                 │    │
│  │  ├── User isolation                                     │    │
│  │  └── Encrypted passwords                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Vector/Realtime                                        │    │
│  │  ├── Real-time subscriptions (ready to use)            │    │
│  │  └── Realtime database changes                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration Flow
```
┌──────────┐
│Sign Up   │
│Form      │
└────┬─────┘
     │
     ↓
┌──────────────────────────┐
│Supabase Auth SignUp      │
│- Hash password (bcrypt)  │
│- Create user             │
│- Send verification email │
└────┬─────────────────────┘
     │
     ↓
┌──────────────────────────┐
│Email Verification        │
│- User clicks link        │
│- /auth/callback route    │
│- Exchange code for token │
└────┬─────────────────────┘
     │
     ↓
┌──────────────────────────┐
│Trigger Profile Creation  │
│- Database trigger        │
│- Create row in profiles  │
│- Link to auth.users      │
└────┬─────────────────────┘
     │
     ↓
┌──────────┐
│Logged In │
│Dashboard │
└──────────┘
```

### Document Creation Flow
```
┌──────────────────────┐
│DocumentForm Component │
├──────────────────────┤
│Recipient: ___        │
│Date: ___             │
│Type: ___             │
│... (other fields)    │
└────┬─────────────────┘
     │
     ↓
┌──────────────────────┐
│handleSubmit()        │
├──────────────────────┤
│- Validate form       │
│- Prepare data        │
│- Add user_id         │
└────┬─────────────────┘
     │
     ↓
┌──────────────────────────┐
│Supabase Insert           │
├──────────────────────────┤
│supabase.from('logs')     │
│  .insert([data])         │
└────┬─────────────────────┘
     │
     ↓
┌──────────────────────┐
│Database RLS Check    │
├──────────────────────┤
│- Verify user_id      │
│- Match auth.uid()    │
└────┬─────────────────┘
     │
     ↓
┌──────────────────────┐
│Insert into logs      │
├──────────────────────┤
│- Create UUID         │
│- Set timestamps      │
│- Store data          │
└────┬─────────────────┘
     │
     ↓
┌──────────────────────┐
│loadDocuments()       │
├──────────────────────┤
│- Fetch updated list  │
│- Update component    │
│- Show in table       │
└────┬─────────────────┘
     │
     ↓
┌──────────────────┐
│List Updated ✓    │
└──────────────────┘
```

## Component Hierarchy

```
Layout (root layout)
├── RootLayout
│   └── children
│       ├── Auth Routes
│       │   ├── /auth/login
│       │   ├── /auth/sign-up
│       │   ├── /auth/callback
│       │   └── /auth/error
│       └── Protected Routes
│           └── /dashboard
│               ├── Header
│               │   ├── User Email
│               │   └── Logout Button
│               └── Main Content
│                   ├── DocumentForm
│                   │   ├── Recipient Input
│                   │   ├── Date Picker
│                   │   ├── Type Selector
│                   │   ├── Classification Select
│                   │   ├── Subject Textarea
│                   │   ├── Location Input
│                   │   ├── Status Selector
│                   │   └── Submit Button
│                   └── DocumentList
│                       ├── Table Header
│                       ├── Table Rows
│                       │   ├── Recipient Cell
│                       │   ├── Type Cell
│                       │   ├── Status Badge
│                       │   ├── Date Cell
│                       │   └── Actions
│                       │       ├── View Button
│                       │       └── Delete Button
│                       └── DocumentDetail Modal
│                           ├── Recipient
│                           ├── Type
│                           ├── Status
│                           ├── Date
│                           ├── Classification
│                           ├── Subject
│                           ├── Location
│                           ├── Created Timestamp
│                           └── Close Button
```

## Authentication Flow

```
User Visits App
      ↓
middleware.ts checks session
      ↓
   ┌──┴──┐
   ↓     ↓
Valid  Invalid
   ↓     ↓
   │   /auth/login
   ↓     ↓
   │   Login Form
   ↓     ↓
   │   Enter Email/Password
   │     ↓
   │   supabase.auth.signInWithPassword()
   │     ↓
   │   Valid Credentials?
   │     ├─ Yes → JWT Token → Set Cookie → /dashboard
   │     └─ No → Show Error
   │
   └→ /dashboard
      ↓
   Dashboard Page
      ↓
   User logged in ✓
```

## Database Schema Relationships

```
                    ┌─────────────────┐
                    │  auth.users     │
                    │─────────────────│
                    │ id (UUID)       │◄──────────────┐
                    │ email           │               │
                    │ password_hash   │               │
                    └────────┬────────┘               │
                             │                        │
                    ┌─────────┴────────┐              │
                    │ (REFERENCES)     │              │
                    │ ON DELETE CASCADE│              │
                    │                  │              │
         ┌──────────▼───────────┐     │              │
         │ public.profiles      │     │              │
         │──────────────────────│     │              │
         │ id (UUID) ◄─────────┐│     │              │
         │ username            ││  FK │              │
         │ full_name           ││     │              │
         │ role                ││     │              │
         │ department          ││     │              │
         │ created_at          ││     │              │
         │ updated_at          ││     │              │
         └──────────┬──────────┘│     │              │
                    │           └─────┘              │
          ┌─────────┴──────────┐                     │
          │ (1 to Many)        │                     │
          │                    │                     │
     ┌────▼──────────────┐     │        ┌────────────▼──────┐
     │ public.logs       │     │        │ public.routed_logs│
     │───────────────────│     │        │───────────────────│
     │ id (UUID)         │     │        │ id (UUID)         │
     │ user_id ◄─────────┼─────┘        │ log_id ◄───┐      │
     │ recipient         │              │ user_id ◄──┼──────┤
     │ document_date     │              │ action     │      │
     │ document_type     │              │ timestamp  │      │
     │ classification    │              │            │      │
     │ subject           │      ┌───────┘            │      │
     │ location          │      │                    │      │
     │ status            │      │ ┌────────────────┐ │      │
     │ created_at        │      │ │ (1 to Many)    │ │      │
     │ updated_at        │◄─────┘ │                 │◄──────┘
     └───────────────────┘        │ References both│
                                   │ users & logs   │
                                   └────────────────┘
```

## Security Layers

```
┌────────────────────────────────────────────────────────┐
│ Layer 1: Middleware (Next.js)                         │
│ - Check authentication status                         │
│ - Redirect unauthenticated users                      │
│ - Refresh tokens                                      │
└────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────┐
│ Layer 2: Application Logic (React Components)        │
│ - Form validation                                      │
│ - User input sanitization                             │
│ - Error handling                                      │
└────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────┐
│ Layer 3: API Client (Supabase Client SDK)            │
│ - JWT token in Authorization header                   │
│ - Secure HTTPS communication                          │
│ - Parameterized queries (prepared statements)         │
└────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────┐
│ Layer 4: Database (PostgreSQL + RLS)                 │
│ - Row Level Security policies                         │
│ - User ID verification (auth.uid())                   │
│ - Query-level access control                          │
│ - Encrypted password storage                          │
└────────────────────────────────────────────────────────┘
```

## State Management

```
User Authentication State
├── Managed by: Supabase Auth
├── Storage: Browser session + Secure HTTP-only cookies
├── Scope: Global (across all pages)
└── Lifetime: Until logout or token expiration

Document State
├── Managed by: React component state (useState)
├── Storage: Component state
├── Scope: Dashboard component
└── Fetched from: Supabase on mount and after changes

Form State
├── Managed by: React component state
├── Storage: Component state
├── Scope: DocumentForm component
└── Cleared: On successful submission
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│ GitHub Repository                                       │
│ - Source code                                           │
│ - Configuration files                                   │
│ - Database setup scripts                                │
└────┬────────────────────────────────────────────────────┘
     │
     │ git push
     │
     ↓
┌─────────────────────────────────────────────────────────┐
│ Vercel                                                  │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Build Process                                     │   │
│ │ - npm install                                     │   │
│ │ - npm run build                                   │   │
│ │ - Optimize for production                         │   │
│ └────────┬────────────────────────────────────────────┘   │
│          │                                             │
│          ↓                                             │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Deployment                                        │   │
│ │ - Deploy to Vercel Edge Network                   │   │
│ │ - Set environment variables                       │   │
│ │ - Configure custom domain (optional)              │   │
│ └────────┬────────────────────────────────────────────┘   │
└─────────┼────────────────────────────────────────────────┘
          │
          ↓
    ┌─────────────┐
    │ Live App    │
    │ Running ✓   │
    └─────────────┘
```

## Performance Optimization Strategy

```
Frontend Optimization
├── Code Splitting
│   └── Pages load only required code
├── Image Optimization
│   └── Next.js automatic optimization
├── Caching
│   ├── Static generation where possible
│   ├── Client-side caching (SWR ready)
│   └── Browser caching headers
└── CSS
    └── Tailwind CSS with PurgeCSS

Backend Optimization
├── Database
│   ├── Indexes on frequently queried fields
│   ├── Query optimization
│   └── Connection pooling (Supabase)
├── API Routes
│   ├── Minimal logic (push to database)
│   └── Fast response times
└── Caching
    └── Supabase automatic query caching
```

---

This architecture provides a scalable, secure, and maintainable foundation for the Document Tracking System.
