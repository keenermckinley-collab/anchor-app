import Link from "next/link";

export default function HomePage() {
  return (
    <section className="panel">
      <h1>When things feel uncertain, keep a clear record.</h1>
      <p>
        Anchor is a private, secure place to document workplace experiences as they happen-so you have
        a clear, time-stamped record, on your terms.
      </p>
      <div className="actions">
        <Link className="btn primary" href="/onboarding">
          Get started
        </Link>
        <Link className="btn" href="/timeline">
          Learn how it works
        </Link>
      </div>
      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Private by design</h2>
        <p>Your records belong to you.</p>
        <p>Anchor keeps your information secure and accessible only to you unless you choose to share it.</p>
      </section>
    </section>
  );
}
