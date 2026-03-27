import Link from "next/link";
import { ShareForm } from "@/components/ShareForm";

export default function SharePage() {
  return (
    <section className="panel">
      <h1>Share your record</h1>
      <p>
        If and when you're ready, you can create a copy of your record to share with a third party, like
        HR or a legal advisor.
      </p>
      <p>You'll be able to review everything before sending.</p>

      <ShareForm />

      <div className="actions">
        <Link className="btn" href="/record">Not now</Link>
        <Link className="btn" href="/share/ready">Your record is ready</Link>
      </div>
    </section>
  );
}
