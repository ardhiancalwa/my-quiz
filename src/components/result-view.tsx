"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Bookmark, Check, X } from "lucide-react";
import { SECTIONS, type Result, type Review } from "@/lib/contracts";
import { useProgress } from "./use-progress";
export function ResultView() {
  const { id } = useParams<{ id: string }>();
  const { progress, ready, update } = useProgress();
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const result = progress.history.find((r) => r.id === id);
  const requestAbort = useRef<AbortController | null>(null);
  useEffect(() => () => requestAbort.current?.abort(), [id]);
  async function refreshExplanations() {
    if (!result) return;
    setRefreshing(true);
    setRefreshError("");
    const controller = new AbortController();
    requestAbort.current = controller;
    try {
      const fresh = new Map<string, Review>();
      for (let i = 0; i < result.reviews.length; i += 50) {
        const batch = result.reviews.slice(i, i + 50);
        const started = await fetch("/api/session", {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "practice",
            ids: batch.map((r) => r.question.id),
            count: 50,
          }),
        });
        const session = await started.json();
        if (!started.ok) throw new Error(session.error);
        const submitted = await fetch("/api/submit", {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: session.token,
            answers: Object.fromEntries(
              batch
                .filter((r) => r.selected)
                .map((r) => [r.question.id, r.selected]),
            ),
          }),
        });
        const graded = await submitted.json();
        if (!submitted.ok) throw new Error(graded.error);
        for (const review of (graded as Result).reviews) {
          if (!review.explanation.steps)
            throw new Error(
              "Pembahasan terbaru belum tersedia untuk soal ini. Coba lagi nanti.",
            );
          fresh.set(review.question.id, review);
        }
      }
      const reviews = result.reviews.map((old) => {
        const current = fresh.get(old.question.id);
        if (
          !current ||
          current.correct !== old.correct ||
          current.question.prompt !== old.question.prompt ||
          JSON.stringify(current.question.options) !==
            JSON.stringify(old.question.options) ||
          JSON.stringify(current.question.segments) !==
            JSON.stringify(old.question.segments) ||
          current.question.passage?.text !== old.question.passage?.text ||
          current.question.audio?.transcript !==
            old.question.audio?.transcript ||
          current.question.audio?.url !== old.question.audio?.url
        )
          throw new Error(
            "Versi soal sudah berubah. Ulangi latihan untuk mendapatkan pembahasan yang sesuai.",
          );
        return { ...old, explanation: current.explanation };
      });
      if (controller.signal.aborted) return;
      await update((p) => ({
        ...p,
        history: p.history.map((r) =>
          r.id === result.id ? { ...r, reviews } : r,
        ),
      }));
    } catch (e) {
      if (!controller.signal.aborted)
        setRefreshError(
          e instanceof Error
            ? e.message
            : "Pembahasan belum dapat diperbarui. Coba lagi.",
        );
    } finally {
      setRefreshing(false);
    }
  }
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
      {result.reviews.some((r) => !r.explanation.steps) && (
        <div className="notice">
          <p>
            Hasil ini memakai pembahasan versi lama. Kamu bisa memuat penjelasan
            terbaru tanpa mengubah nilai dan riwayat latihan.
          </p>
          <button
            className="button white small"
            disabled={refreshing}
            onClick={() => void refreshExplanations()}
          >
            {refreshing ? "Memuat pembahasan…" : "Perbarui pembahasan"}
          </button>
        </div>
      )}
      {refreshError && (
        <p className="error" role="alert">
          {refreshError}
        </p>
      )}
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
                  {r.explanation.why.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {r.explanation.rule && (
                    <div className="explanation-rule">
                      <strong>{r.explanation.concept}</strong>
                      <p>{r.explanation.rule}</p>
                    </div>
                  )}
                  {r.explanation.steps && (
                    <>
                      <h3>Cara menentukannya, langkah demi langkah</h3>
                      <ol className="reasoning-steps">
                        {r.explanation.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </>
                  )}
                  {r.explanation.correction && (
                    <div className="corrected-sentence">
                      <span>Kalimat setelah diperbaiki</span>
                      <p>{r.explanation.correction.sentence}</p>
                    </div>
                  )}
                  {r.explanation.evidence && (
                    <>
                      <h3>
                        {r.question.section === "listening"
                          ? "Bukti dari percakapan"
                          : "Bukti dari bacaan"}
                      </h3>
                      <p className="evidence">{r.explanation.evidence}</p>
                    </>
                  )}
                  <h3>
                    {r.question.type === "error"
                      ? "Mengapa bagian lain tidak dipilih?"
                      : "Mengapa pilihan lainnya salah?"}
                  </h3>
                  {r.question.options
                    .filter((o) => o.id !== r.correct)
                    .map((o) => (
                      <div className="distractor-explanation" key={o.id}>
                        <strong>
                          {o.id}. {o.text}
                        </strong>
                        <p>{r.explanation.incorrect[o.id]}</p>
                      </div>
                    ))}
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
                    <h3>Tips & trik untuk soal serupa</h3>
                    <p>{r.explanation.tip}</p>
                    {r.explanation.pitfall && (
                      <>
                        <strong>Jebakan yang perlu dihindari</strong>
                        <p>{r.explanation.pitfall}</p>
                      </>
                    )}
                  </div>
                  {r.explanation.example && (
                    <div className="mini-example">
                      <h3>Contoh pembanding</h3>
                      <p>{r.explanation.example}</p>
                    </div>
                  )}
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
