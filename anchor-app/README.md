# Anchor App (Next.js)

Production-oriented starter for Anchor with:
- App Router pages using updated Anchor naming and voice
- API routes for records, sharing, webhooks, and user rights
- PostgreSQL schema support
- Security headers middleware

## Stack
- Next.js 14 + TypeScript
- PostgreSQL (`pg`)
- Zod request validation

## Quick Start

1. Copy env file:

```sh
cp .env.example .env.local
```

2. Install dependencies:

```sh
npm install
```

3. Run app:

```sh
npm run dev
```

4. Open `http://localhost:3000`.

## API Endpoints
- `GET /api/health`
- `GET /api/records` and `POST /api/records`
- `POST /api/share`
- `POST /api/assets/presign`
- `POST /api/assets/complete`
- `POST /api/webhooks/email-events`
- `POST /api/webhooks/replies`
- `GET /api/account/export`
- `DELETE /api/account/delete`

## Important Notes
- Auth0 session-based auth is scaffolded in `app/api/auth/[auth0]/route.ts`.
- API routes map authenticated sessions to local `users` records automatically.
- `x-user-id` header remains as a local development fallback only.
- Delivery/open tracking is enabled by webhook events.
- Reply parsing is optional and opt-in per share action.

## Launch Docs
- `docs/launch/auth0-setup.md`
- `docs/launch/webhooks-and-uploads.md`
- `docs/launch/deploy-vercel.md`
- `docs/launch/deploy-aws.md`
