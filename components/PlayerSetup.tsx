"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Match } from "@/types/game";
import { createGame, defaultName, MAX_PLAYERS, MIN_PLAYERS } from "@/lib/game";
import { markFreshDraw, readSetupDraft, saveGame, saveSetupDraft } from "@/lib/storage";
import { track } from "@/lib/analytics";

const COUNTS = Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => i + MIN_PLAYERS);

export function PlayerSetup({ match }: { match: Match }) {
  // Só é montado no cliente (depois de ler o storage), por isso pode ler já o rascunho.
  const [draft] = useState(readSetupDraft);
  const [step, setStep] = useState<"count" | "names">("count");
  const [count, setCount] = useState<number | null>(
    draft && draft.count >= MIN_PLAYERS && draft.count <= MAX_PLAYERS ? draft.count : null,
  );
  // Guarda sempre 8 nomes: mudar o número não apaga o que já foi escrito.
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: MAX_PLAYERS }, (_, i) => draft?.names[i] ?? ""),
  );
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function chooseCount(n: number) {
    setCount(n);
    saveSetupDraft({ count: n, names });
    setStep("names");
    window.scrollTo({ top: 0 });
  }

  function setName(index: number, value: string) {
    const next = names.map((n, j) => (j === index ? value : n));
    setNames(next);
    if (count) saveSetupDraft({ count, names: next });
  }

  function draw(e: React.FormEvent) {
    e.preventDefault();
    if (!count) return;
    const chosen = names.slice(0, count);
    const game = createGame(match, chosen);
    markFreshDraw(1);
    saveGame(game);
    track("game_started", { players: count, named: chosen.filter((n) => n.trim()).length });
    window.scrollTo({ top: 0 });
  }

  const backButton = (onClick?: () => void) => {
    const icon = (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    const cls = "-ml-2 flex h-11 w-11 items-center justify-center text-muted";
    return onClick ? (
      <button type="button" onClick={onClick} className={cls} aria-label="Voltar ao número de jogadores">
        {icon}
      </button>
    ) : (
      <Link href="/" className={cls} aria-label="Voltar ao início">
        {icon}
      </Link>
    );
  };

  const topBar = (onBack?: () => void, stepLabel = "") => (
    <div className="flex items-center justify-between pt-4 md:pt-10">
      {backButton(onBack)}
      <span className="text-sm text-muted">
        {match.teamA} vs {match.teamB}
      </span>
      <span className="w-11 text-right text-sm text-muted">{stepLabel}</span>
    </div>
  );

  if (step === "count" || !count) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        {topBar(undefined, "1/2")}
        <div className="rise flex flex-1 flex-col justify-center pb-24 md:pb-32">
          <h1 className="font-display text-[2.75rem] leading-none font-bold uppercase md:text-[4rem]">
            Quantos vão jogar?
          </h1>
          <div className="mt-8 grid grid-cols-4 gap-2.5 md:grid-cols-7">
            {COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => chooseCount(n)}
                aria-pressed={count === n}
                className={`flex h-20 items-center justify-center rounded-2xl font-display text-4xl font-bold transition-[transform,background-color] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:h-24 ${
                  count === n
                    ? "bg-ink text-bg"
                    : "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-surface-2"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <form onSubmit={draw} className="mx-auto flex w-full max-w-xl flex-1 flex-col">
      {topBar(() => setStep("count"), "2/2")}

      <div className="rise mt-6">
        <h1 className="font-display text-[2.75rem] leading-none font-bold uppercase md:text-[4rem]">
          Quem joga?
        </h1>
      </div>

      <div className="rise mt-5 grid gap-2 md:mt-6 md:grid-cols-2" style={{ animationDelay: "60ms" }}>
        {Array.from({ length: count }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={names[i]}
            onChange={(e) => setName(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && i < count - 1) {
                e.preventDefault();
                inputs.current[i + 1]?.focus();
              }
            }}
            placeholder={defaultName(i)}
            aria-label={`Nome do ${defaultName(i).toLowerCase()}`}
            maxLength={16}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint={i < count - 1 ? "next" : "go"}
            className="h-14 rounded-xl bg-surface px-4 text-[17px] text-ink shadow-[inset_0_0_0_1px_var(--color-line)] outline-none placeholder:text-muted/60 focus:shadow-[inset_0_0_0_2px_var(--color-ink)]"
          />
        ))}
      </div>

      <div className="action-bar mt-auto pt-6">
        <button type="submit" className="btn btn-primary">
          Sortear eventos
        </button>
      </div>
    </form>
  );
}
