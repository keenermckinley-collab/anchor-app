import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="panel">
      <h1>Sign in to Anchor</h1>
      <p className="small">Launch auth supports email/password with MFA, plus social/SSO.</p>

      <label htmlFor="email">Email</label>
      <input id="email" type="email" placeholder="you@example.com" />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" placeholder="********" />

      <div className="actions">
        <Link className="btn primary" href="/api/auth/login">Continue with email</Link>
        <Link className="btn" href="/api/auth/login?connection=google-oauth2">Continue with Google</Link>
        <Link className="btn" href="/api/auth/login?connection=windowslive">Continue with Microsoft</Link>
        <Link className="btn" href="/api/auth/logout">Log out</Link>
      </div>

      <p className="small">After sign-in, multi-factor verification is required.</p>
    </section>
  );
}
