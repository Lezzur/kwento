# Supabase Authentication & Cloud Sync Setup

This guide walks you through setting up Supabase authentication and cloud sync for Kwento.

## Prerequisites

- A Supabase account (free tier works fine)
- Node.js and npm installed
- This project cloned locally

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Project name**: kwento (or your preferred name)
   - **Database password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project" and wait for provisioning

## Step 2: Run SQL Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the contents of `supabase-schema.sql` from this project
4. Paste into the SQL editor
5. Click "Run" to execute

This creates:
- 12 database tables (projects, characters, scenes, etc.)
- Row Level Security (RLS) policies
- Indexes for performance

## Step 3: Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Find these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: Your anonymous public key
   - **service_role**: Your service role key (keep secret!)

## Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Important**: Never commit `.env.local` to git!

## Step 5: Install Dependencies

```bash
npm install
```

This installs the required Supabase packages:
- `@supabase/supabase-js`
- `@supabase/ssr`

## Step 6: Test Authentication

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. You should see the authentication modal

4. Click "Sign up" and create an account with your email

5. Check your email for the confirmation link

6. Click the confirmation link

7. Sign in with your credentials

## Step 7: Verify Sync

Once logged in:

1. Check the top-right corner for:
   - **Sync Indicator**: Shows sync status (syncing, synced, offline, error)
   - **User Menu**: Shows your email and last sync time

2. Create some content (cards, characters, etc.)

3. Watch the sync indicator change to "Syncing..." then "Synced"

4. Check Supabase dashboard → **Table Editor** → **projects** to see your data

## How It Works

### Offline-First Architecture

- **Local storage**: Dexie (IndexedDB) is the primary data store
- **Cloud backup**: Supabase provides authentication and cloud sync
- **Sync strategy**:
  - Push local changes to cloud
  - Pull cloud changes to local
  - Last-write-wins conflict resolution

### Automatic Sync Triggers

Sync happens automatically:
- On login (migrates existing local data)
- Every 5 minutes (periodic background sync)
- On window focus (when you return to the tab)
- Before window unload (when you close the tab)
- Manual: Click "Sync Now" in User Menu

### Data Migration

When you sign up/login for the first time:
- Existing local data is associated with your user ID
- All local records are marked for sync
- Data is pushed to Supabase
- Future logins on other devices will pull this data

## Security

- **Row Level Security (RLS)**: Users can only access their own data
- **Anonymous key**: Safe to use in client (RLS protects data)
- **Service role key**: Only for server-side admin tasks (keep secret!)
- **Email confirmation**: Required before account is active

## Troubleshooting

### "Invalid API key" error
- Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after changing env vars

### Sync keeps showing "pending"
- Check browser console for errors
- Verify RLS policies are enabled in Supabase
- Try "Sync Now" from User Menu

### Email confirmation not arriving
- Check spam folder
- In Supabase dashboard → **Authentication** → **Settings**, verify email settings
- For development, you can disable email confirmation (not recommended for production)

### Data not syncing across devices
- Ensure you're logged in with the same account
- Check sync indicator shows "Synced" on both devices
- Try manual sync on both devices

## Development Tips

### Testing Offline Mode

1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Create/edit content
4. Sync indicator should show "Offline"
5. Restore network
6. Sync indicator should auto-sync and show "Synced"

### Viewing Local Database

1. Open DevTools → Application tab
2. Expand IndexedDB → KwentoDB
3. Explore tables to see local data

### Resetting Local Data

```javascript
// In browser console
const db = await window.indexedDB.databases()
db.forEach(d => window.indexedDB.deleteDatabase(d.name))
location.reload()
```

## Production Deployment

Before deploying to production:

1. **Environment Variables**: Set env vars in your hosting platform (Vercel, Netlify, etc.)
2. **Email Provider**: Configure production email provider in Supabase
3. **Domain Whitelist**: Add your domain to Supabase → **Authentication** → **URL Configuration**
4. **Rate Limiting**: Configure rate limits in Supabase dashboard
5. **Backup**: Set up automated backups in Supabase dashboard

## Support

For issues or questions:
- Check the [Supabase docs](https://supabase.com/docs)
- Review the implementation plan in this project
- Check browser console for error messages
