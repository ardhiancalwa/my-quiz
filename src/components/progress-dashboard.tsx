"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Download,
  Upload,
  Trash2,
  Target,
  Clock3,
} from "lucide-react";
import { SECTIONS, EMPTY_PROGRESS, type Session } from "@/lib/contracts";
import { parseImport } from "@/lib/progress";
import { useProgress } from "./use-progress";
import { ConfirmDialog } from "./confirm-dialog";
export function ProgressDashboard() {
  const { progress, ready, storageError, update } = useProgress();
  const [message, setMessage] = useState("");
  const [reset, setReset] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const total = progress.history.reduce((n, r) => n + r.total, 0);
  const correct = progress.history.reduce((n, r) => n + r.correct, 0);
  const topicStats = new Map<
    string,
    { right: number; total: number; section: string }
  >();
  for (const r of progress.history)
    for (const item of r.reviews) {
      const t = topicStats.get(item.question.topic) ?? {
        right: 0,
        total: 0,
        section: item.question.section,
      };
      t.total++;
      if (item.selected === item.correct) t.right++;
      topicStats.set(item.question.topic, t);
    }
  const weakest = [...topicStats.entries()]
    .sort((a, b) => a[1].right / a[1].total - b[1].right / b[1].total)
    .slice(0, 3);
  const wrong = [
    ...new Set(
      progress.history.flatMap((r) =>
        r.reviews
          .filter((x) => x.selected !== x.correct)
          .map((x) => x.question.id),
      ),
    ),
  ];
  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ ...progress, active: null }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eprt-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function importData(file?: File) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setMessage("File maksimal 10 MB.");
      return;
    }
    try {
      const imported = parseImport(await file.text());
      await update((p) => ({
        ...p,
        history: [
          ...new Map(
            [...p.history, ...imported.history].map((r) => [r.id, r]),
          ).values(),
        ].sort((a, b) => b.completedAt - a.completedAt),
        bookmarks: [...new Set([...p.bookmarks, ...imported.bookmarks])],
      }));
      setMessage("Progres berhasil digabungkan. Sesi aktif tetap tersimpan.");
    } catch {
      setMessage(
        "File tidak valid. Gunakan file export progres EPrT versi 1. Data lama tetap aman.",
      );
    } finally {
      if (input.current) input.current.value = "";
    }
  }
  async function retry(ids: string[]) {
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "practice", ids, count: 50 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await update((p) => ({ ...p, active: data as Session }));
      router.push("/sesi");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Tidak dapat memulai sesi.");
    }
  }
  if (!ready) return <p>Memuat progres…</p>;
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">YOUR LEARNING JOURNAL</span>
        <h1>Setiap sesi ada ceritanya.</h1>
        <p>Lihat yang sudah kamu pahami, lalu tentukan langkah berikutnya.</p>
      </div>
      {progress.active && (
        <div className="resume-strip">
          <span>
            <Clock3 size={18} /> Sesi latihanmu masih menunggu.
          </span>
          <Link href="/sesi" className="text-link">
            Lanjutkan sesi <ArrowRight size={17} />
          </Link>
        </div>
      )}
      <div className="stats-row">
        <div>
          <Target />
          <span>Akurasi keseluruhan</span>
          <strong>
            {total ? `${Math.round((correct / total) * 100)}%` : "—"}
          </strong>
        </div>
        <div>
          <span>Sesi selesai</span>
          <strong>{progress.history.length}</strong>
        </div>
        <div>
          <span>Soal dikerjakan</span>
          <strong>{total}</strong>
        </div>
        <div>
          <Bookmark />
          <span>Bookmark</span>
          <strong>{progress.bookmarks.length}</strong>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading compact">
            <h2>Latihan berikutnya</h2>
            <span className="eyebrow">BERDASARKAN PROGRESMU</span>
          </div>
          {weakest.length ? (
            weakest.map(([topic, s]) => (
              <Link
                key={topic}
                className="topic-row"
                href={`/latihan?section=${s.section}`}
              >
                <span>
                  <strong>{topic}</strong>
                  <small>
                    {s.right} dari {s.total} benar ·{" "}
                    {Math.round((s.right / s.total) * 100)}% akurasi
                  </small>
                </span>
                <ArrowUpRight size={20} />
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <p>Belum ada pola yang bisa dibaca.</p>
              <p className="muted">
                Selesaikan latihan pertama untuk melihat topik yang perlu
                diulang.
              </p>
              <Link href="/latihan" className="text-link">
                Mulai latihan <ArrowRight size={16} />
              </Link>
            </div>
          )}
          <div className="review-actions">
            <button disabled={!wrong.length} onClick={() => void retry(wrong)}>
              Ulangi kesalahan ({wrong.length}) <ArrowRight size={16} />
            </button>
            <button
              disabled={!progress.bookmarks.length}
              onClick={() => void retry(progress.bookmarks)}
            >
              Buka bookmarks ({progress.bookmarks.length}){" "}
              <Bookmark size={16} />
            </button>
          </div>
        </section>
        <section className="panel">
          <h2>Per bagian</h2>
          {SECTIONS.map((s) => {
            const reviews = progress.history.flatMap((r) =>
              r.reviews.filter((x) => x.question.section === s.id),
            );
            const n = reviews.filter((r) => r.selected === r.correct).length;
            const percent = reviews.length
              ? Math.round((n / reviews.length) * 100)
              : 0;
            return (
              <div className="performance" key={s.id}>
                <div>
                  <span>{s.name}</span>
                  <strong>
                    {reviews.length ? `${percent}%` : "Belum ada sesi"}
                  </strong>
                </div>
                <div className="bar">
                  <span style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </section>
      </div>
      <section className="panel history-panel">
        <div className="section-heading compact">
          <h2>Riwayat latihan</h2>
          <span>{progress.history.length} sesi</span>
        </div>
        {progress.history.length ? (
          <div className="history-table">
            {progress.history.map((r) => (
              <Link key={r.id} href={`/hasil/${r.id}`}>
                <span>
                  <strong>
                    {r.mode === "exam" ? "Simulasi lengkap" : "Latihan mandiri"}
                  </strong>
                  <small>
                    {new Date(r.completedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </small>
                </span>
                <span>
                  {r.correct}/{r.total} benar
                </span>
                <strong>{Math.round((r.correct / r.total) * 100)}%</strong>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">
            Riwayat akan muncul setelah kamu menyelesaikan sesi.
          </p>
        )}
      </section>
      <section className="data-panel">
        <div>
          <h2>Progres ini milikmu.</h2>
          <p>
            Tersimpan di browser ini. Ekspor sebagai cadangan sebelum menghapus
            data browser. Export mencakup riwayat dan bookmarks; sesi aktif
            tetap di perangkat ini.
          </p>
        </div>
        <div className="data-actions">
          <button className="button white small" onClick={exportData}>
            <Download size={16} /> Ekspor JSON
          </button>
          <button
            className="button white small"
            onClick={() => input.current?.click()}
          >
            <Upload size={16} /> Impor JSON
          </button>
          <button
            className="icon-button"
            aria-label="Hapus seluruh progres lokal"
            onClick={() => setReset(true)}
          >
            <Trash2 size={19} />
          </button>
          <input
            ref={input}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(e) => void importData(e.target.files?.[0])}
          />
        </div>
      </section>
      {(message || storageError) && (
        <p role="status" className="notice">
          {message || storageError}
        </p>
      )}
      {reset && (
        <ConfirmDialog
          labelledBy="reset-title"
          onCancel={() => setReset(false)}
        >
          <h2 id="reset-title">Hapus progres perangkat ini?</h2>
          <p>
            Riwayat, bookmarks, dan sesi aktif akan dihapus. Ekspor cadangan
            terlebih dahulu jika masih diperlukan.
          </p>
          <div className="hero-actions">
            <button
              autoFocus
              className="button white"
              onClick={() => setReset(false)}
            >
              Batal
            </button>
            <button
              className="button"
              onClick={() =>
                void update(() => structuredClone(EMPTY_PROGRESS))
                  .then(() => {
                    setReset(false);
                    setMessage("Progres lokal telah dihapus.");
                  })
                  .catch(() => setMessage("Data belum berhasil dihapus."))
              }
            >
              Hapus progres
            </button>
          </div>
        </ConfirmDialog>
      )}
    </>
  );
}
