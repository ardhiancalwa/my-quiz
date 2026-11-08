"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  Headphones,
  Play,
} from "lucide-react";
import { SECTIONS, type Session, type Result } from "@/lib/contracts";
import { useProgress } from "./use-progress";
import { ConfirmDialog } from "./confirm-dialog";
export function SessionRunner() {
  const { progress, ready, storageError, update } = useProgress();
  const router = useRouter();
  const session = progress.active;
  const [now, setNow] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const sending = useRef(false);
  const audio = useRef<HTMLAudioElement>(null);
  const submit = useCallback(async () => {
    if (!session || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: session.token,
          answers: session.answers,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if ("reviews" in data) {
        const result = data as Result;
        await update((p) => ({
          ...p,
          active: null,
          history: [result, ...p.history.filter((r) => r.id !== result.id)],
        }));
        router.push(`/hasil/${result.id}`);
      } else {
        await update((p) => ({ ...p, active: data as Session }));
        setConfirm(false);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Jawaban belum terkirim. Coba lagi.",
      );
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }, [session, update, router]);
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (
      session?.deadline &&
      now >= session.deadline &&
      !sending.current &&
      !error
    )
      void submit();
  }, [now, session, submit, error]);
  if (!ready)
    return (
      <div className="wrap page-space">
        <p>Memuat sesi tersimpan…</p>
      </div>
    );
  if (!session)
    return (
      <div className="wrap page-space empty">
        <h1>Belum ada sesi aktif.</h1>
        <p>Pilih satu bagian untuk mulai berlatih.</p>
        <Link href="/latihan" className="button">
          Pilih latihan <ArrowRight size={18} />
        </Link>
      </div>
    );
  const q = session.questions[session.index];
  const answered = Object.keys(session.answers).length;
  const remaining = session.deadline
    ? Math.max(0, Math.ceil((session.deadline - now) / 1000))
    : null;
  const expired =
    session.deadline !== null && now >= session.deadline && now > 0;
  const saved = progress.bookmarks.includes(q.id);
  const played = q.audio && session.played.includes(q.audio.id);
  function patch(change: Partial<Session>) {
    void update((p) => ({
      ...p,
      active: p.active ? { ...p.active, ...change } : null,
    })).catch(() => {});
  }
  function navigate(index: number) {
    if (session!.questions[index].audio?.id !== q.audio?.id)
      audio.current?.pause();
    patch({ index });
  }
  async function playExam() {
    if (!q.audio || played) return;
    try {
      await update((p) => ({
        ...p,
        active: p.active
          ? {
              ...p.active,
              played: [...new Set([...p.active.played, q.audio!.id])],
            }
          : null,
      }));
      await audio.current?.play();
    } catch {
      setError("Audio tidak dapat diputar. Periksa izin dan koneksi.");
      await update((p) => ({
        ...p,
        active: p.active
          ? {
              ...p.active,
              played: p.active.played.filter((id) => id !== q.audio!.id),
            }
          : null,
      }));
    }
  }
  return (
    <div className="wrap session-page">
      <div className="session-top">
        <Link href="/latihan" className="text-link">
          <ArrowLeft size={17} /> Simpan & keluar
        </Link>
        <span>
          {session.mode === "exam"
            ? `SIMULASI · BAGIAN ${session.stage + 1}/3`
            : "LATIHAN MANDIRI"}{" "}
          · {q.section.toUpperCase()}
        </span>
        <div className={`timer ${expired ? "danger" : ""}`}>
          <Clock3 size={17} />
          {remaining === null
            ? "Tanpa timer"
            : now === 0
              ? "Memuat…"
              : `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`}
        </div>
      </div>
      <div className="session-progress">
        <span
          style={{ width: `${(answered / session.questions.length) * 100}%` }}
        />
      </div>
      <div className="session-grid">
        <article className="question-panel panel">
          <div className="question-heading">
            <span className="eyebrow">
              SOAL {session.index + 1} / {session.questions.length}
            </span>
            <button
              className={`icon-button ${saved ? "is-saved" : ""}`}
              aria-label={saved ? "Hapus bookmark" : "Simpan bookmark"}
              aria-pressed={saved}
              onClick={() =>
                void update((p) => ({
                  ...p,
                  bookmarks: saved
                    ? p.bookmarks.filter((id) => id !== q.id)
                    : [...p.bookmarks, q.id],
                })).catch(() => {})
              }
            >
              <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="question-meta">
            <span>{q.topic}</span>
            <span>Menengah</span>
            {q.status === "draft" && <span>Draf demo</span>}
          </div>
          {q.passage && (
            <section className="passage">
              <h2>{q.passage.title}</h2>
              {q.passage.text.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          )}
          {q.audio && (
            <div className="audio-player">
              <div>
                <Headphones size={21} />
                <strong>
                  {q.type === "short-dialogue"
                    ? "Short dialogue"
                    : q.type === "lecture"
                      ? "Lecture"
                      : "Long dialogue"}
                </strong>
              </div>
              {session.mode === "exam" ? (
                <>
                  <audio
                    ref={audio}
                    key={q.audio.id}
                    src={q.audio.url}
                    preload="none"
                    onError={() =>
                      setError(
                        "File audio tidak tersedia. Coba lagi atau laporkan ke pengelola.",
                      )
                    }
                  />
                  <button
                    className="button white small"
                    onClick={playExam}
                    disabled={!!played || expired || busy}
                  >
                    <Play size={16} />
                    {played ? "Audio sudah dimulai" : "Putar audio satu kali"}
                  </button>
                  <small>
                    {played
                      ? "Rekaman ini tidak dapat dimulai ulang, termasuk setelah refresh."
                      : "Siapkan headphone sebelum memutar. Soal dalam grup memakai satu rekaman."}
                  </small>
                </>
              ) : (
                <>
                  <audio
                    key={q.audio.id}
                    controls
                    preload="none"
                    src={q.audio.url}
                    ref={audio}
                    onError={() => setError("File audio tidak tersedia.")}
                  />
                  <label className="speed">
                    Kecepatan
                    <select
                      defaultValue="1"
                      onChange={(e) => {
                        if (audio.current)
                          audio.current.playbackRate = Number(e.target.value);
                      }}
                    >
                      <option value="0.75">0.75×</option>
                      <option value="1">1×</option>
                      <option value="1.25">1.25×</option>
                    </select>
                  </label>
                </>
              )}
            </div>
          )}
          {q.segments && (
            <p className="error-sentence">
              {q.segments.map((segment, i) => (
                <span className="error-segment" key={i}>
                  <span>{segment.text}</span>
                  <small>{segment.label}</small>
                </span>
              ))}
            </p>
          )}
          <h1 className="question-prompt">{q.prompt}</h1>
          <fieldset className="answers" disabled={busy || expired}>
            <legend className="sr-only">Pilih jawaban</legend>
            {q.options.map((o) => (
              <label
                className={session.answers[q.id] === o.id ? "chosen" : ""}
                key={o.id}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={o.id}
                  checked={session.answers[q.id] === o.id}
                  onChange={() =>
                    patch({ answers: { ...session.answers, [q.id]: o.id } })
                  }
                />
                <span className="answer-letter">{o.id}</span>
                <span>{o.text}</span>
                {session.answers[q.id] === o.id && <Check size={18} />}
              </label>
            ))}
          </fieldset>
          <div className="question-actions">
            <button
              className="button white small"
              disabled={session.index === 0 || busy}
              onClick={() => navigate(session.index - 1)}
            >
              <ArrowLeft size={17} /> Sebelumnya
            </button>
            {session.index < session.questions.length - 1 ? (
              <button
                className="button small"
                disabled={busy}
                onClick={() => navigate(session.index + 1)}
              >
                Berikutnya <ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="button small"
                disabled={busy}
                onClick={() => setConfirm(true)}
              >
                Selesaikan {session.mode === "exam" ? "bagian" : "latihan"}{" "}
                <Check size={17} />
              </button>
            )}
          </div>
        </article>
        <aside className="question-sidebar">
          <div className="panel">
            <span className="eyebrow">PETA SOAL</span>
            <h2>
              {answered} <span>/ {session.questions.length} terjawab</span>
            </h2>
            <div className="question-map">
              {session.questions.map((question, i) => (
                <button
                  aria-label={`Buka soal ${i + 1}${session.answers[question.id] ? ", terjawab" : ""}`}
                  aria-current={i === session.index ? "step" : undefined}
                  className={`${session.answers[question.id] ? "answered" : ""} ${i === session.index ? "current" : ""}`}
                  key={question.id}
                  onClick={() => navigate(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="map-legend">
              <span>
                <i /> Belum dijawab
              </span>
              <span>
                <i className="done" /> Terjawab
              </span>
            </div>
            <button
              className="button white full"
              disabled={busy}
              onClick={() => setConfirm(true)}
            >
              {session.mode === "exam" ? "Kirim bagian ini" : "Akhiri latihan"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="autosave">
            <Check size={15} /> Jawaban disimpan otomatis di browser ini.
          </p>
          {session.mode === "exam" && (
            <p className="footnote">
              {SECTIONS[session.stage].name}: {SECTIONS[session.stage].minutes}{" "}
              menit. Waktu terus berjalan saat halaman ditutup.
            </p>
          )}
        </aside>
      </div>
      {(error || storageError) && (
        <div className="error" role="alert">
          {error || storageError}{" "}
          {error && (
            <button onClick={() => void submit()} disabled={busy}>
              Coba kirim lagi
            </button>
          )}
        </div>
      )}
      {confirm && (
        <ConfirmDialog
          labelledBy="confirm-title"
          onCancel={() => setConfirm(false)}
        >
          <h2 id="confirm-title">
            Kirim {session.mode === "exam" ? "bagian ini" : "latihan"}?
          </h2>
          <p>
            {session.questions.length - answered} soal belum dijawab.{" "}
            {session.mode === "exam"
              ? "Jawaban bagian ini tidak dapat diubah setelah dikirim."
              : "Kamu bisa membaca pembahasan setelah mengirim."}
          </p>
          <div className="hero-actions">
            <button
              autoFocus
              className="button white"
              onClick={() => setConfirm(false)}
            >
              Kembali
            </button>
            <button
              className="button"
              disabled={busy}
              onClick={() => void submit()}
            >
              {busy ? "Mengirim…" : "Ya, kirim"}
            </button>
          </div>
        </ConfirmDialog>
      )}
    </div>
  );
}
