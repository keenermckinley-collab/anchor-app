# Anchor Workspace

This workspace contains:
- `anchor-app/`: Next.js production-oriented starter app
- `database/schema.sql`: PostgreSQL schema
- `architecture/ARCHITECTURE.md`: architecture and security decisions
- `anchor-web/`: static prototype pages

## Fastest Path To Launch
1. Start in `anchor-app/`.
2. Install dependencies and run the app.
3. Apply `db/migrations/001_init.sql` to PostgreSQL.
4. Integrate production auth (email/password+MFA and social/SSO).
5. Connect email delivery/open webhooks and optional reply parsing webhook.

## Notes
- Product naming and tone are updated to Anchor.
- Privacy Policy is implemented at `/privacy`.
- Share flow uses hybrid receipt handling:
  - Webhook delivery/open tracking enabled by default
  - Reply parsing optional and opt-in
