import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Log in" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/record", label: "Your Record" },
  { href: "/record/add", label: "Add a record" },
  { href: "/timeline", label: "Timeline" },
  { href: "/share", label: "Share your record" },
  { href: "/account", label: "Account" },
  { href: "/help", label: "Help" },
  { href: "/privacy", label: "Privacy" },
];

export function Nav() {
  return (
    <header className="topbar">
      <div className="shell nav">
        <div className="logo">A ANCHOR</div>
        <nav className="navLinks">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
