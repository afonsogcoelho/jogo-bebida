"use client";

import { useEffect, useRef, useState } from "react";
import type { Challenge, Player } from "@/types/game";
import { timesLabel } from "@/lib/game";

// Todas as linhas rodam ao mesmo tempo e param em cascata:
// 2 jogadores ≈ 1,6 s · 8 jogadores ≈ 3,7 s.
const FIRST_STOP_MS = 1200;
const STOP_GAP_MS = 350;
const TICK_MS = 55;
const SLOWDOWN_MS = 650;

export interface PlayerResult {
  main: Challenge;
  rare: Challenge;
}

interface Props {
  players: Player[];
  /** playerId -> desafio principal + evento raro (já sorteados e gravados) */
  results: Record<string, PlayerResult>;
  /** Desafios principais da ronda, para passarem durante a animação */
  pool: Challenge[];
  animate: boolean;
  onDone?: () => void;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Índice do texto a mostrar: rápido no início, abranda perto da paragem. */
function spinIndex(elapsed: number, stopAt: number, offset: number) {
  const slowFrom = stopAt - SLOWDOWN_MS;
  if (elapsed < slowFrom) return Math.floor(elapsed / TICK_MS) + offset;
  const x = elapsed - slowFrom;
  const slowed = Math.log(1 + x * 0.006) / 0.006 / TICK_MS; // integral de 1/(1+0.006x)
  return Math.floor(slowFrom / TICK_MS + slowed) + offset;
}

export function DrawReveal({ players, results, pool, animate, onDone }: Props) {
  const [running] = useState(() => animate && !prefersReducedMotion());
  const [elapsed, setElapsed] = useState(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const totalMs = FIRST_STOP_MS + (players.length - 1) * STOP_GAP_MS + 400;

  useEffect(() => {
    if (!running) {
      if (animate) onDoneRef.current?.();
      return;
    }
    const start = performance.now();
    const id = window.setInterval(() => {
      const t = performance.now() - start;
      setElapsed(t);
      if (t >= totalMs) {
        window.clearInterval(id);
        onDoneRef.current?.();
      }
    }, TICK_MS / 2);
    return () => window.clearInterval(id);
  }, [running, animate, totalMs]);

  const spinning = running && animate;

  return (
    <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
      {players.map((p, i) => {
        const result = results[p.id];
        if (!result) return null;
        const { main, rare } = result;
        const stopAt = FIRST_STOP_MS + i * STOP_GAP_MS;
        const landed = !spinning || elapsed >= stopAt;
        const rolling = pool[spinIndex(elapsed, stopAt, i * 3) % pool.length];

        return (
          <li
            key={p.id}
            data-landed={landed}
            className={`flex min-w-0 flex-col rounded-[20px] px-5 pt-4 pb-3.5 transition-colors duration-300 ${
              landed ? "bg-surface-2" : "bg-surface"
            } shadow-[inset_0_0_0_1px_var(--color-line)] ${landed && spinning ? "land" : ""}`}
          >
            <span className="text-[15px] font-medium text-muted">{p.name}</span>

            {/* Desafio principal */}
            {landed ? (
              <div className={`mt-1 flex items-start justify-between gap-4 ${spinning ? "pop" : ""}`}>
                <div className="min-w-0">
                  <p className="font-display text-[1.75rem] leading-[1.05] font-bold text-balance uppercase">
                    {main.text}
                  </p>
                  {main.note && <p className="mt-1.5 text-sm text-muted">{main.note}</p>}
                </div>
                <span className="shrink-0 font-display text-[2rem] leading-none font-bold" aria-label={`${main.times} vezes`}>
                  {timesLabel(main.times)}
                </span>
              </div>
            ) : (
              <div className="mt-1 flex items-start justify-between gap-4">
                <p
                  key={rolling.id}
                  aria-hidden="true"
                  className="slot-tick min-w-0 flex-1 truncate font-display text-[1.75rem] leading-[1.05] font-bold text-ink/35 uppercase"
                >
                  {rolling.text}
                </p>
                <span className="shrink-0 font-display text-[2rem] leading-none font-bold text-ink/20" aria-hidden="true">
                  ?x
                </span>
              </div>
            )}

            {/* Evento raro: secundário, revelado quando o principal assenta */}
            <div className="mt-3 flex items-baseline gap-3 border-t border-line pt-2.5">
              <span className="shrink-0 text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">Raro</span>
              {landed ? (
                <>
                  <span className={`min-w-0 flex-1 text-[15px] text-ink/90 ${spinning ? "pop pop-late" : ""}`}>
                    {rare.text}
                  </span>
                  <span
                    className={`shrink-0 font-display text-lg leading-none font-bold text-accent ${spinning ? "pop pop-late" : ""}`}
                    aria-label={`${rare.times} vezes`}
                  >
                    {timesLabel(rare.times)}
                  </span>
                </>
              ) : (
                <span className="flex-1 text-[15px] text-muted/60" aria-hidden="true">
                  a sortear…
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
