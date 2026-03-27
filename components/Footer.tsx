import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footerInner">
        <span>Anchor</span>
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
}
