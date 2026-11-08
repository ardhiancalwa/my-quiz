import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";
import "@fontsource/ubuntu/700.css";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "EPrT Practice — Kenali polanya.",
    template: "%s · EPrT Practice",
  },
  description:
    "Latihan Listening, Grammar, dan Reading tanpa akun. Pembahasan dalam bahasa Indonesia dan progres tersimpan di perangkatmu.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Lewati ke konten
        </a>
        <header className="site-header">
          <Link href="/" className="brand" aria-label="EPrT Practice beranda">
            <span className="brand-mark">
              e<span>•</span>
            </span>
            <span>
              EPrT<span className="brand-light">practice</span>
            </span>
          </Link>
          <nav aria-label="Navigasi utama">
            <Link href="/latihan">Latihan</Link>
            <Link href="/simulasi">Simulasi</Link>
            <Link href="/progres">
              Progres <span className="desktop-word">belajar</span>
            </Link>
          </nav>
          <Link className="button small header-cta" href="/latihan">
            Mulai latihan <ArrowUpRight size={16} />
          </Link>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div>
            <Link href="/" className="brand footer-brand">
              <span className="brand-mark">
                e<span>•</span>
              </span>
              <span>EPrT practice</span>
            </Link>
            <p>Belajar pelan-pelan, pahami satu per satu.</p>
          </div>
          <div>
            <p>
              Platform latihan independen, tanpa afiliasi dengan Telkom
              University.
            </p>
            <Link href="/tentang">
              Tentang format & sumber <ArrowRight size={14} />
            </Link>
            <p className="muted">
              Progres tersimpan hanya di browser dan perangkat ini.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
