# Migration from PHP to Next.js + Supabase

This document explains the migration from the original PHP Document Tracking System to a modern Next.js + Supabase architecture.

## What Changed

### Before (PHP)
- **Backend**: PHP with MySQL database
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Authentication**: Session-based with PHP
- **Hosting**: Vercel with PHP runtime
- **Database**: Self-managed MySQL

### After (Next.js + Supabase)
- **Backend**: Supabase (Managed PostgreSQL)
- **Frontend**: Next.js with React components
- **Authentication**: Supabase Auth (JWT-based)
- **Hosting**: Vercel (optimized for Next.js)
- **Database**: Managed by Supabase with RLS policies

## Key Improvements

### 1. **Modern Architecture**
- TypeScript for type safety
- React components for reusable UI
- Server/Client separation with Next.js
- API routes for backend logic

### 2. **Security**
- Row Level Security (RLS) policies in database
- Secure JWT-based authentication
- No hardcoded credentials
- Environment variables for secrets

### 3. **Developer Experience**
- Hot module reloading
- Integrated TypeScript support
- Tailwind CSS for styling
- Clear project structure

### 4. **Scalability**
- Managed database by Supabase
- Automatic backups and recovery
- Real-time capabilities (if needed)
- Edge functions support

### 5. **Cost**
- Supabase free tier for small projects
- No server maintenance costs
- Pay-as-you-go pricing

## Database Migration

### Old Schema (MySQL)
```sql
CREATE TABLE logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  recipient VARCHAR(255),
  document_date DATE,
  document_type VARCHAR(100),
  classification VARCHAR(50),
  subject TEXT,
  location VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP
);
```

### New Schema (PostgreSQL)
```sql
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
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
```

### Key Differences
- **IDs**: Changed from AUTO_INCREMENT to UUIDs
- **User references**: Direct link to Supabase auth.users
- **Timestamps**: PostgreSQL TIMESTAMP instead of MySQL DATETIME
- **Text fields**: TEXT instead of VARCHAR
- **Constraints**: Added NOT NULL and DEFAULT constraints

## API Changes

### Old PHP Approach
```php
// api.php
if ($action === 'add_document') {
  $recipient = $_POST['recipient'];
  $db->insert('logs', ['recipient' => $recipient]);
}
```

### New Next.js Approach
```typescript
// app/api/documents/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const { data, error } = await supabase
    .from('logs')
    .insert([{ ...body, user_id: user.id }])
  
  if (error) throw error
  return Response.json(data)
}
```

### Benefits
- Type-safe request handling
- Built-in error handling
- RESTful API design
- Automatic CORS handling

## Authentication Migration

### Old System
- Session cookies
- User table in MySQL
- Manual password hashing
- No email verification

### New System
- JWT tokens with Supabase Auth
- Built-in user management
- Automatic password hashing (bcrypt)
- Email verification
- Auto-refresh tokens

## Frontend Migration

### Old (Vanilla JavaScript)
```html
<form onsubmit="addDocument()">
  <input type="text" id="recipient">
  <button type="submit">Add</button>
</form>
<script>
  function addDocument() {
    fetch('api.php', { method: 'POST', body: formData })
  }
</script>
```

### New (React Components)
```tsx
export function DocumentForm({ onSubmit }) {
  const [recipient, setRecipient] = useState('')
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ recipient }) }}>
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  )
}
```

### Benefits
- Reusable components
- Automatic re-rendering
- Built-in state management
- Better error handling

## Deployment

### Old Deployment
1. Upload PHP files to Vercel
2. Configure PHP runtime
3. Set database connection in code
4. Deploy

### New Deployment
1. Push Next.js code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy (Next.js optimized)

## Data Migration Steps

If you have existing data in the old MySQL database:

1. **Export data** from MySQL
```bash
mysqldump -u root doc_manager > backup.sql
```

2. **Transform data** to match new schema
   - Convert user IDs to Supabase user IDs
   - Convert date formats
   - Update any field types

3. **Import to Supabase**
   - Use Supabase SQL editor
   - Run insert statements with transformed data

4. **Verify data**
   - Check row counts
   - Verify relationships
   - Test queries

## Troubleshooting Migration

### Issue: User IDs don't match
**Solution**: Create a mapping between old user IDs and Supabase UUIDs

### Issue: Date format errors
**Solution**: Convert dates to ISO format (YYYY-MM-DD)

### Issue: Foreign key violations
**Solution**: Ensure referenced users exist in auth.users first

### Issue: RLS policies blocking queries
**Solution**: Check that queries include proper user_id filtering

## Old Files Removed

The following PHP files are no longer needed:
- `api.php` - Now handled by Next.js API routes
- `dashboard.php` - Now `/app/dashboard/page.tsx`
- `login.php` - Now `/app/auth/login/page.tsx`
- `db_connect.php` - Replaced by Supabase client
- `index.php` - Now `/app/page.tsx`
- `run_migration.php` - Not needed with Supabase

## Next Steps

1. **Set up Supabase** (see SETUP.md)
2. **Run database setup** script
3. **Migrate existing data** (if any)
4. **Test all features** in development
5. **Deploy to production**
6. **Monitor performance** and errors

## Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project README: See README.md

## Questions?

- Check the documentation
- Review the code comments
- Open an issue on GitHub
