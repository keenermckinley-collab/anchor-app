import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anchor",
  description: "A private, secure place to document workplace experiences over time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>
          <div className="shell">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
