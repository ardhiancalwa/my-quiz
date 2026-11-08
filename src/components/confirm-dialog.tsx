"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function ConfirmDialog({
  labelledBy,
  onCancel,
  children,
}: {
  labelledBy: string;
  onCancel: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={labelledBy}
      className="panel confirm-dialog native-dialog"
      onCancel={onCancel}
    >
      {children}
    </dialog>
  );
}
