import Link from "next/link";
import { SECTIONS } from "@/lib/contracts";
export default function About() {
  return (
    <article className="wrap page-space prose-page">
      <span className="eyebrow">FORMAT & SUMBER</span>
      <h1>Latihan dengan arah yang jelas.</h1>
      <p>
        EPrT Practice adalah platform latihan independen. Kami tidak berafiliasi
        dengan Telkom University Language Center dan tidak menerbitkan
        sertifikat atau skor EPrT resmi.
      </p>
      <h2>Format yang digunakan</h2>
      <p>
        Halaman layanan resmi LaC menyebut pembagian berikut. Waktu pengerjaan
        total adalah 125 menit; pelaksanaan tes resmi disebut sekitar 2–3 jam,
        termasuk kegiatan lain di luar pengerjaan.
      </p>
      <table>
        <thead>
          <tr>
            <th>Bagian</th>
            <th>Soal</th>
            <th>Waktu</th>
          </tr>
        </thead>
        <tbody>
          {SECTIONS.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.count}</td>
              <td>{s.minutes} menit</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Simulasi mengikuti urutan Listening, Grammar, dan Reading. Dokumen
        contoh LaC memuat 30 short dialogue, 10 long dialogue, 10 lecture; serta
        15 sentence completion dan 25 error recognition. Pada contoh tersebut
        audio diputar satu kali. Replay tersedia pada mode latihan.
      </p>
      <h2>Latihan dan tes resmi</h2>
      <p>
        Persyaratan akun, Zoom, Safe Exam Browser, identitas, dan pengawasan
        pada halaman LaC berlaku untuk tes resmi. Platform latihan ini dapat
        digunakan tanpa akun, kamera, atau perangkat lunak ujian tambahan.
      </p>
      <h2>Konten dan progres</h2>
      <p>
        Soal ditulis untuk proyek ini. Konten bertanda draf demo belum melewati
        review pengajar. Jawaban, pembahasan, dan audio perlu diperiksa sebelum
        dipublikasikan sebagai materi tervalidasi.
      </p>
      <p>
        Progres disimpan di IndexedDB pada browser ini. Menghapus data browser
        dapat menghapus riwayat. Gunakan ekspor JSON untuk cadangan; tidak ada
        sinkronisasi antarperangkat.
      </p>
      <h2>Sumber acuan</h2>
      <ul>
        <li>
          <a
            href="https://lac.telkomuniversity.ac.id/layanan/tes-bahasa/eprt/"
            target="_blank"
            rel="noreferrer"
          >
            Halaman layanan EPrT LaC ↗
          </a>
        </li>
        <li>
          <a
            href="https://lac.telkomuniversity.ac.id/wp-content/uploads/2024/08/Contoh-Soal-EPrT%C2%AE.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Dokumen contoh soal LaC ↗
          </a>
        </li>
        <li>
          <a
            href="https://lac.telkomuniversity.ac.id/contoh-soal-grammar-eprt-tiap-bagian-dan-jawabannya/"
            target="_blank"
            rel="noreferrer"
          >
            Contoh Grammar per bagian ↗
          </a>
        </li>
        <li>
          <a
            href="https://lac.telkomuniversity.ac.id/contoh-soal-reading-eprt-beserta-jawaban-dan-pembahasannya/"
            target="_blank"
            rel="noreferrer"
          >
            Contoh Reading dan pembahasan ↗
          </a>
        </li>
      </ul>
      <p className="muted">
        Format diperiksa 8 November 2026. Gunakan halaman resmi untuk
        persyaratan dan informasi tes yang berlaku.
      </p>
      <Link href="/latihan" className="button">
        Mulai latihan ↗
      </Link>
    </article>
  );
}
