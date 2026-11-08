"use client";
import { useEffect, useRef, useState } from "react";
import { EMPTY_PROGRESS, type Progress } from "@/lib/contracts";
import { readProgress, writeProgress } from "@/lib/progress";
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const current = useRef(progress);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    readProgress()
      .then((p) => {
        current.current = p;
        setProgress(p);
        setReady(true);
      })
      .catch(() => {
        setStorageError(
          "Browser tidak mengizinkan penyimpanan lokal. Aktifkan penyimpanan untuk menyimpan progres.",
        );
        setReady(true);
      });
  }, []);
  function update(change: (p: Progress) => Progress) {
    const next = change(current.current);
    current.current = next;
    setProgress(next);
    const pending = queue.current
      .catch(() => {})
      .then(() => writeProgress(next));
    queue.current = pending;
    pending.catch(() =>
      setStorageError(
        "Progres belum tersimpan. Ruang penyimpanan mungkin penuh. Ekspor progres sebelum menutup halaman.",
      ),
    );
    return pending;
  }
  return { progress, ready, storageError, update };
}
