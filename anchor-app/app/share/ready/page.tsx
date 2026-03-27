import Link from "next/link";

export default function ShareReadyPage() {
  return (
    <section className="panel">
      <h1>Your record is ready</h1>
      <p>We've compiled your time-stamped records and attachments into a single document.</p>
      <p>You can download it or share it directly.</p>
      <div className="actions">
        <button className="btn primary" type="button">Download PDF</button>
        <Link className="btn" href="/share">Share now</Link>
      </div>
    </section>
  );
}
