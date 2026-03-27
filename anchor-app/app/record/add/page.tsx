import Link from "next/link";
import { AddRecordForm } from "@/components/AddRecordForm";

export default function AddRecordPage() {
  return (
    <section className="panel">
      <h1>Add a record</h1>
      <p>Take a moment to describe what happened. Include as much detail as you can remember.</p>
      <p>You can also add screenshots, photos, or other files to support your notes.</p>

      <AddRecordForm />
      <div className="actions">
        <Link className="btn" href="/timeline">
          View timeline
        </Link>
      </div>
    </section>
  );
}
