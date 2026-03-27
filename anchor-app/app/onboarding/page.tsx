import Link from "next/link";

export default function OnboardingPage() {
  return (
    <section className="panel">
      <h1>You're not alone.</h1>
      <p>If something doesn't feel right at work, Anchor is here to help you keep track of it.</p>
      <p>
        Capture what happened, when it happened, and any supporting details-privately and securely. You
        can add to your record at any time.
      </p>
      <p>You don't have to decide what to do next right now. Just start by documenting.</p>
      <div className="actions">
        <Link className="btn primary" href="/record/add">
          Start your record
        </Link>
      </div>
    </section>
  );
}
