"use client";

import { useEffect } from "react";

interface Props {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({ title, body, confirmLabel, onConfirm, onCancel }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div className="backdrop absolute inset-0 bg-black/65" onClick={onCancel} />
      <div className="sheet relative mx-auto w-full max-w-[440px] rounded-t-3xl bg-surface px-5 pt-7 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:rounded-3xl md:px-8 md:pb-6">
        <h2 id="sheet-title" className="font-display text-[2.25rem] leading-none font-bold uppercase">
          {title}
        </h2>
        <p className="mt-3 text-muted">{body}</p>
        <div className="mt-7 flex flex-col gap-2">
          <button type="button" className="btn btn-primary" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Ainda não
          </button>
        </div>
      </div>
    </div>
  );
}
