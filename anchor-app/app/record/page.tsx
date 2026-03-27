import Link from "next/link";

export default function RecordPage() {
  return (
    <section className="panel">
      <h1>Your Record</h1>
      <p>You haven't added anything yet.</p>
      <p>When something happens, write it down while it's fresh. Even small details can matter later.</p>
      <div className="actions">
        <Link className="btn primary" href="/record/add">
          Add a record
        </Link>
      </div>
    </section>
  );
}
