import Link from "next/link";

export default function TimelinePage() {
  return (
    <section className="panel">
      <h1>Your timeline</h1>
      <p>Your records are organized by time to help you track patterns and details clearly.</p>
      <ul>
        <li><strong>2026-03-27 10:14</strong> Record saved</li>
        <li><strong>2026-03-27 10:15</strong> Supporting file added</li>
      </ul>
      <div className="actions">
        <Link className="btn" href="/record">Back to Your Record</Link>
        <Link className="btn primary" href="/share">Share your record</Link>
      </div>
    </section>
  );
}
