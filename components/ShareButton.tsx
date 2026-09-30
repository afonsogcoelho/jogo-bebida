"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

interface Props {
  text: string;
  label: string;
  location: "landing" | "game" | "final";
  kind?: "link" | "round";
  variant?: "primary" | "secondary" | "ghost";
}

export function ShareButton({ text, label, location, kind = "link", variant = "secondary" }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.origin;
    const nativeShare = typeof navigator.share === "function";
    track("share_clicked", { location, kind, method: nativeShare ? "native" : "copy" });

    if (nativeShare) {
      try {
        await navigator.share({ text, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank");
    }
  }

  return (
    <button type="button" onClick={share} className={`btn btn-${variant}`} aria-live="polite">
      <ShareIcon />
      {copied ? "Link copiado" : label}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12M12 3l-4 4M12 3l4 4M5 12v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
