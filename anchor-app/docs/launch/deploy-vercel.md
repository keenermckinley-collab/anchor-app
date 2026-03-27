# Deploy On Vercel

## 1. Create Project
- Connect this repo to Vercel.
- Root directory: `anchor-app`.

## 2. Set Environment Variables
Set all required vars from `.env.example`.

## 3. Database
- Provision Postgres (Neon, RDS, Supabase, etc.).
- Run `db/migrations/001_init.sql`.

## 4. Domains
- Configure staging and production domains.
- Update Auth0 callback/logout/web origin settings.

## 5. Verify
- `/api/health` returns `ok: true`
- Login/logout works
- Record creation works
- Share action + webhook events work
- Privacy page accessible at `/privacy`
