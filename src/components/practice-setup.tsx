"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Headphones,
  PenLine,
  BookOpen,
  Check,
  ShieldCheck,
} from "lucide-react";
import { SECTIONS, type Section, type Session } from "@/lib/contracts";
import { useProgress } from "./use-progress";
export function PracticeSetup({
  initial = "grammar",
  topics,
  counts,
  demo,
  exam = false,
}: {
  initial?: Section;
  topics: { section: Section; topic: string }[];
  counts: Record<string, number>;
  demo: boolean;
  exam?: boolean;
}) {
  const router = useRouter();
  const { progress, ready, storageError, update } = useProgress();
  const [section, setSection] = useState(initial);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState("");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [audioChecked, setAudioChecked] = useState(false);
  async function start() {
    setBusy(true);
    setError("");
    try {
      const attempted = new Set(
        progress.history.flatMap((r) => r.reviews.map((x) => x.question.id)),
      );
      const wrong = [
        ...new Set(
          progress.history.flatMap((r) =>
            r.reviews
              .filter((x) => x.selected !== x.correct)
              .map((x) => x.question.id),
          ),
        ),
      ];
      const ids = filter === "wrong" ? wrong : undefined;
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: exam ? "exam" : "practice",
          section: exam ? undefined : section,
          topic: topic || undefined,
          difficulty: difficulty || undefined,
          count,
          ids,
          excludeIds: filter === "new" ? [...attempted] : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      await update((p) => ({ ...p, active: result as Session }));
      router.push("/sesi");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tidak dapat memulai sesi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="setup-layout">
      <div>
        <div className="page-intro">
          <span className="eyebrow">
            {exam ? "A DRESS REHEARSAL" : "YOUR DAILY PRACTICE"}
          </span>
          <h1>{exam ? "Coba ritme ujian." : "Hari ini, mau latihan apa?"}</h1>
          <p>
            {exam
              ? "Tiga bagian, satu langkah lebih siap. Luangkan waktu dan siapkan headphone."
              : "Pilih satu bagian. Sepuluh soal juga sudah jadi langkah awal."}
          </p>
        </div>
        {demo && (
          <p className="notice">
            Mode demo: {Object.values(counts).reduce((a, b) => a + b, 0)} soal
            draf orisinal, belum ditinjau pengajar. Hasil bukan skor EPrT resmi.
          </p>
        )}
        {progress.active && (
          <div className="resume-strip">
            <span>Ada sesi yang belum selesai.</span>
            <a href="/sesi" className="text-link">
              Lanjutkan <ArrowRight size={16} />
            </a>
          </div>
        )}
        {exam ? (
          <div className="panel exam-instructions">
            <h2>Kenali alurnya dulu.</h2>
            <ol>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <strong>{s.name}</strong>
                  <span>
                    {s.count} soal · {s.minutes} menit
                  </span>
                </li>
              ))}
            </ol>
            <p>
              Bagian dikerjakan berurutan. Waktu yang tersisa pada suatu bagian
              tidak dipindahkan ke bagian berikutnya. Setelah bagian dikirim,
              jawaban bagian itu tidak bisa diubah.
            </p>
            <p>
              Audio simulasi diputar satu kali per rekaman. Pembahasan dan
              transcript baru tersedia setelah seluruh simulasi selesai.
            </p>
            <div className="audio-check">
              <strong>01 / Cek audio</strong>
              <audio
                controls
                preload="none"
                src="/audio/listening-1.mp3"
                onPlay={() => setAudioChecked(true)}
              />
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={audioChecked}
                  onChange={(e) => setAudioChecked(e.target.checked)}
                />{" "}
                Saya sudah mendengar audio dengan jelas.
              </label>
            </div>
            <p className="muted">
              Deadline tetap berjalan saat tab ditutup atau halaman dimuat
              ulang. Pastikan koneksi tersedia saat mengirim jawaban.
            </p>
          </div>
        ) : (
          <div className="panel setup-panel">
            <h2 className="step-title">
              <span>01</span> Pilih bagian
            </h2>
            <div className="section-options">
              {SECTIONS.map((s, i) => {
                const Icon = [Headphones, PenLine, BookOpen][i];
                return (
                  <button
                    aria-pressed={section === s.id}
                    className={section === s.id ? "selected" : ""}
                    key={s.id}
                    onClick={() => {
                      setSection(s.id);
                      setTopic("");
                    }}
                  >
                    <Icon size={22} />
                    <strong>{s.name}</strong>
                    <small>{counts[s.id] ?? 0} soal tersedia</small>
                    {section === s.id && (
                      <Check size={16} className="option-check" />
                    )}
                  </button>
                );
              })}
            </div>
            <h2 className="step-title">
              <span>02</span> Atur sesimu
            </h2>
            <div className="form-grid">
              <label>
                Topik
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="">Semua topik</option>
                  {topics
                    .filter((t) => t.section === section)
                    .map((t) => (
                      <option key={t.topic}>{t.topic}</option>
                    ))}
                </select>
              </label>
              <label>
                Jumlah soal
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                >
                  {[5, 10, 20, 40, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} soal
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tingkat kesulitan
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Semua tingkat</option>
                  <option value="easy">Mudah</option>
                  <option value="medium">Menengah</option>
                  <option value="hard">Sulit</option>
                </select>
              </label>
              <label>
                Pilih dari
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Semua soal</option>
                  <option value="new">Belum pernah dikerjakan</option>
                  <option value="wrong">Pernah salah</option>
                </select>
              </label>
            </div>
            <p className="muted">
              Jumlah aktual mengikuti soal yang cocok dengan filter. Tidak ada
              timer pada mode latihan.
            </p>
          </div>
        )}
        {(error || storageError) && (
          <p role="alert" className="error">
            {error || storageError}
          </p>
        )}
        <button
          className="button start-button"
          disabled={!ready || busy || !!storageError || (exam && !audioChecked)}
          onClick={start}
        >
          {busy
            ? "Menyiapkan sesi…"
            : exam
              ? "Mulai simulasi"
              : "Mulai sesi latihan"}{" "}
          <ArrowRight size={19} />
        </button>
        {progress.active && (
          <p className="footnote">
            Memulai sesi baru akan menggantikan sesi aktif.
          </p>
        )}
      </div>
      <aside className="setup-aside">
        <div className="aside-sticker">
          <ShieldCheck size={34} />
          <h3>Fokus ke proses.</h3>
          <p>
            Tidak perlu membuat akun. Jawaban dinilai di server, progres
            disimpan di browser ini.
          </p>
          <hr />
          <p>
            Setelah selesai, luangkan waktu untuk membaca pembahasan. Di situ
            kamu bisa menemukan pola yang terlewat.
          </p>
          <span className="aside-star" aria-hidden="true">
            ✳
          </span>
        </div>
        <a
          className="source-link"
          href="https://lac.telkomuniversity.ac.id/layanan/tes-bahasa/eprt/"
          target="_blank"
          rel="noreferrer"
        >
          Lihat format EPrT resmi ↗
        </a>
      </aside>
    </div>
  );
}
