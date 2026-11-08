"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Bookmark, Check, X } from "lucide-react";
import { SECTIONS } from "@/lib/contracts";
import { useProgress } from "./use-progress";
export function ResultView() {
  const { id } = useParams<{ id: string }>();
  const { progress, ready, update } = useProgress();
  const [onlyWrong, setOnlyWrong] = useState(false);
  const result = progress.history.find((r) => r.id === id);
  if (!ready) return <p>Memuat hasil…</p>;
  if (!result)
    return (
      <div className="empty">
        <h1>Hasil tidak ditemukan di browser ini.</h1>
        <p>Hasil hanya tersedia pada perangkat tempat sesi diselesaikan.</p>
        <Link href="/latihan" className="button">
          Mulai latihan
        </Link>
      </div>
    );
  return (
    <>
      <div className="result-heading">
        <span className="eyebrow">ONE SESSION, ONE STEP FORWARD</span>
        <h1>Sekarang, pahami alasannya.</h1>
        <p>Hasil latihan menunjukkan bagian yang bisa kamu pelajari lagi.</p>
      </div>
      <div className="result-summary">
        <div className="result-score">
          <span>AKURASI</span>
          <strong>
            {Math.round((result.correct / result.total) * 100)}
            <small>%</small>
          </strong>
          <span>
            {result.correct} dari {result.total} soal benar
          </span>
        </div>
        <div className="result-counts">
          <div>
            <strong>{result.correct}</strong>
            <span>Benar</span>
          </div>
          <div>
            <strong>{result.incorrect}</strong>
            <span>Salah</span>
          </div>
          <div>
            <strong>{result.unanswered}</strong>
            <span>Kosong</span>
          </div>
          <div>
            <strong>
              {Math.max(
                1,
                Math.round((result.completedAt - result.startedAt) / 60000),
              )}
              <small> mnt</small>
            </strong>
            <span>Waktu sesi</span>
          </div>
        </div>
      </div>
      <p className="footnote">
        Hasil ini adalah akurasi latihan, bukan konversi skor EPrT resmi.{" "}
        {result.reviews.some((r) => r.question.status === "draft") &&
          "Sesi memakai soal draf demo yang belum ditinjau pengajar."}
      </p>
      <div className="section-results">
        {SECTIONS.map((s) => {
          const list = result.reviews.filter(
            (r) => r.question.section === s.id,
          );
          return list.length ? (
            <div key={s.id}>
              <span>{s.name}</span>
              <strong>
                {list.filter((r) => r.selected === r.correct).length} /{" "}
                {list.length}
              </strong>
            </div>
          ) : null;
        })}
      </div>
      <div className="section-heading">
        <h2>Bedah jawabanmu.</h2>
        <label className="check-label">
          <input
            type="checkbox"
            checked={onlyWrong}
            onChange={(e) => setOnlyWrong(e.target.checked)}
          />{" "}
          Hanya salah & kosong
        </label>
      </div>
      <div className="review-list">
        {result.reviews
          .filter((r) => !onlyWrong || r.selected !== r.correct)
          .map((r) => {
            const index = result.reviews.indexOf(r);
            const saved = progress.bookmarks.includes(r.question.id);
            return (
              <details className="panel review-item" key={r.question.id}>
                <summary>
                  <span
                    className={`review-status ${r.selected === r.correct ? "right" : "wrong"}`}
                  >
                    {r.selected === r.correct ? (
                      <Check size={18} />
                    ) : (
                      <X size={18} />
                    )}
                  </span>
                  <span>
                    <small>
                      SOAL {index + 1} · {r.question.topic}
                    </small>
                    <strong>
                      {r.question.type === "error"
                        ? r.question.segments?.map((s) => s.text).join(" ")
                        : r.question.prompt}
                    </strong>
                  </span>
                  <span className="review-selected">
                    {r.selected ?? "—"} → {r.correct}
                  </span>
                </summary>
                <div className="review-body">
                  {r.question.passage && (
                    <div className="passage">
                      <h3>{r.question.passage.title}</h3>
                      {r.question.passage.text.split("\n\n").map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  )}
                  <div className="review-choices">
                    {r.question.options.map((o) => (
                      <p
                        key={o.id}
                        className={
                          o.id === r.correct
                            ? "correct-choice"
                            : o.id === r.selected
                              ? "incorrect-choice"
                              : ""
                        }
                      >
                        <strong>{o.id}.</strong> {o.text}{" "}
                        {o.id === r.correct && <Check size={15} />}
                      </p>
                    ))}
                  </div>
                  <h3>Mengapa jawaban ini benar?</h3>
                  <p>{r.explanation.why}</p>
                  <h3>Pilihan lainnya</h3>
                  {r.question.options
                    .filter((o) => o.id !== r.correct)
                    .map((o) => (
                      <p key={o.id}>
                        <strong>{o.id}.</strong> {r.explanation.incorrect[o.id]}
                      </p>
                    ))}
                  {r.explanation.evidence && (
                    <>
                      <h3>Bukti & konteks</h3>
                      <p className="evidence">{r.explanation.evidence}</p>
                    </>
                  )}
                  {r.question.audio && (
                    <>
                      <h3>Dengarkan kembali</h3>
                      <audio
                        controls
                        preload="none"
                        src={r.question.audio.url}
                      />
                      <h3>Transcript</h3>
                      <p>{r.question.audio.transcript}</p>
                    </>
                  )}
                  <div className="learning-tip">
                    <strong>{r.explanation.concept}</strong>
                    <p>{r.explanation.tip}</p>
                  </div>
                  <button
                    className="text-link"
                    onClick={() =>
                      void update((p) => ({
                        ...p,
                        bookmarks: saved
                          ? p.bookmarks.filter((id) => id !== r.question.id)
                          : [...p.bookmarks, r.question.id],
                      })).catch(() => {})
                    }
                  >
                    <Bookmark
                      size={17}
                      fill={saved ? "currentColor" : "none"}
                    />
                    {saved
                      ? "Tersimpan di bookmarks"
                      : "Simpan untuk dipelajari lagi"}
                  </button>
                </div>
              </details>
            );
          })}
      </div>
      <div className="hero-actions">
        <Link href="/latihan" className="button">
          Latihan lagi <ArrowRight size={18} />
        </Link>
        <Link href="/progres" className="button white">
          Lihat progres
        </Link>
      </div>
    </>
  );
}
