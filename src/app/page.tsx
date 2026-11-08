import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Headphones,
  BookOpen,
  PenLine,
  Check,
  Plus,
} from "lucide-react";
import { SECTIONS } from "@/lib/contracts";
export default function Home() {
  return (
    <>
      <section className="hero grid-paper wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="spark">✳</span> A little practice, every day.
          </div>
          <h1>
            Kenali polanya.
            <br />
            Siap hadapi
            <br />
            <span className="highlight">EPrT.</span>
            <span className="title-star" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p>
            Listening, Grammar, dan Reading.
            <br />
            Kerjakan soalnya, pahami alasannya,
            <br className="desktop-word" /> lalu coba lagi sampai kamu mengerti.
          </p>
          <div className="hero-actions">
            <Link href="/latihan" className="button">
              Mulai latihan <ArrowUpRight size={20} />
            </Link>
            <Link href="/simulasi" className="button white">
              Coba simulasi <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero-note">
            <span className="dot" /> Gratis. Tanpa akun. Langsung belajar.
          </div>
        </div>
        <div className="hero-art">
          <div className="art-label">YOUR NEXT CHAPTER STARTS HERE ↗</div>
          <Image
            src="/study-club.svg"
            alt="Ilustrasi pelajar memakai headphone, membaca buku, dan menyiapkan catatan"
            width={520}
            height={505}
            priority
          />
          <div className="art-sticker">
            <Check size={19} /> One question at a time.
          </div>
          <span className="art-scribble" aria-hidden="true">
            ↶
          </span>
        </div>
      </section>
      <div className="facts wrap">
        <span>
          <strong>3</strong> bagian latihan
        </span>
        <span>
          <strong>140</strong> soal per simulasi
        </span>
        <span>
          <strong>125</strong> menit pengerjaan
        </span>
        <Link href="/tentang">
          Sesuai format EPrT <ArrowUpRight size={16} />
        </Link>
      </div>
      <section className="wrap section-space" id="pilih-latihan">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MULAI DARI MANA?</span>
            <h2>Satu bagian dulu juga boleh.</h2>
          </div>
          <p>Pilih kemampuan yang ingin kamu latih hari ini.</p>
        </div>
        <div className="section-cards">
          {SECTIONS.map((s, i) => {
            const Icon = [Headphones, PenLine, BookOpen][i];
            return (
              <Link
                key={s.id}
                className={`section-card tone-${i}`}
                href={`/latihan?section=${s.id}`}
              >
                <span className="card-top">
                  <span className="icon-tile">
                    <Icon size={25} />
                  </span>
                  <span className="card-number">0{i + 1}</span>
                </span>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <div className="card-bottom">
                  <span>
                    {s.count} soal · {s.minutes} menit*
                  </span>
                  <ArrowUpRight size={23} />
                </div>
              </Link>
            );
          })}
        </div>
        <p className="footnote">
          *Jumlah soal dan durasi pada simulasi lengkap. Latihan per topik bisa
          lebih singkat.
        </p>
      </section>
      <section className="wrap how-section">
        <div>
          <span className="eyebrow">PAHAMI, BUKAN SEKADAR MENJAWAB</span>
          <h2>
            Salah? Mari cari
            <br />
            tahu <span className="underline-pink">kenapa.</span>
          </h2>
          <p>
            Setelah menjawab, baca konsep yang diuji dan alasan setiap pilihan.
            Simpan soal yang ingin kamu pelajari lagi.
          </p>
          <Link href="/latihan" className="text-link">
            Coba satu sesi <ArrowRight size={18} />
          </Link>
        </div>
        <div className="example-sheet">
          <div className="sheet-label">
            <PenLine size={17} /> GRAMMAR · CONTOH PEMBAHASAN
          </div>
          <p className="example-sentence">
            Mira avoids <span>using</span> her phone
            <br />
            during lectures.
          </p>
          <div className="example-feedback">
            <Check size={19} />
            <div>
              <strong>Mengapa “using”?</strong>
              <p>
                Kata kerja <i>avoid</i> diikuti gerund (verb + -ing). Polanya:
                avoid doing something.
              </p>
            </div>
          </div>
          <span className="sheet-corner">
            <Plus />
          </span>
        </div>
      </section>
      <section className="wrap simulation-banner">
        <span className="banner-star" aria-hidden="true">
          ✳
        </span>
        <div>
          <span className="eyebrow">SIAP MENCOBA SELURUHNYA?</span>
          <h2>Ambil waktu. Uji persiapanmu.</h2>
          <p>
            Tiga bagian berurutan, timer per bagian, dan pembahasan setelah
            selesai.
          </p>
        </div>
        <Link href="/simulasi" className="button white">
          Lihat simulasi <ArrowUpRight size={20} />
        </Link>
      </section>
    </>
  );
}
