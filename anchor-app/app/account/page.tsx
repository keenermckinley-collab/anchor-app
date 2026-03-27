import { AccountActions } from "@/components/AccountActions";

export default function AccountPage() {
  return (
    <section className="panel">
      <h1>Account and privacy controls</h1>
      <p>You can export your data or request account deletion at any time.</p>
      <p className="small">Data deletion happens within a reasonable timeframe after your request.</p>
      <AccountActions />
    </section>
  );
}
