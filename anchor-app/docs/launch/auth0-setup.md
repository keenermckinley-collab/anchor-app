# Auth0 Setup For Anchor

## Goal
Enable launch auth with:
- Email/password login
- MFA
- Social/SSO (Google and Microsoft)

## 1. Create Auth0 Application
- Type: Regular Web Application
- Allowed Callback URLs:
  - `http://localhost:3000/api/auth/callback`
  - `https://your-staging-domain/api/auth/callback`
  - `https://your-production-domain/api/auth/callback`
- Allowed Logout URLs:
  - `http://localhost:3000`
  - `https://your-staging-domain`
  - `https://your-production-domain`
- Allowed Web Origins:
  - `http://localhost:3000`
  - `https://your-staging-domain`
  - `https://your-production-domain`

## 2. Enable Email/Password
- Turn on Database Connection for your app.
- Require email verification.
- Set strong password policy.

## 3. Enable MFA
- Enable at least one factor (Authenticator app + email fallback recommended).
- Set policy to require MFA after login for all users.

## 4. Enable Social/SSO
- Google connection: set Google client id/secret in Auth0.
- Microsoft connection: set Microsoft client id/secret in Auth0.
- Ensure both connections are enabled for this application.

## 5. App Environment Variables
Set these in `.env.local` and in staging/production:

```bash
AUTH0_SECRET=...
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=...
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
```

## 6. App Paths
- Auth route: `app/api/auth/[auth0]/route.ts`
- Login entry UI: `/login`

## 7. Production Hardening
- Rotate secrets regularly.
- Enable attack protection in Auth0.
- Enforce brute-force protection and suspicious IP throttling.
