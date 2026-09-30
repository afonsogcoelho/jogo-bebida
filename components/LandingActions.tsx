"use client";

import { useState } from "react";
import type { Match } from "@/types/game";
import { clearGame, useGame, useMatchMode } from "@/lib/storage";
import { totalChallenges } from "@/lib/game";
import { formatWeekday } from "@/lib/dates";
import { track } from "@/lib/analytics";
import { ShareButton } from "@/components/ShareButton";
import { ChallengePreview } from "@/components/ChallengePreview";
import { ConfirmSheet } from "@/components/ConfirmSheet";

// Entre "/" e "/jogo" usamos links normais (<a>), não <Link>/router: o site é um export
// estático e a navegação no cliente do Next depende de ficheiros RSC que o Cloudflare Pages
// não serve. Quando falham, o Next faz um location.replace (apaga o histórico) ou fica preso
// após um regresso do bfcache do Safari. Um carregamento normal evita as duas coisas.

export function LandingActions({ match }: { match: Match }) {
  const mode = useMatchMode(match);
  const game = useGame(match);
  const [confirmNew, setConfirmNew] = useState(false);

  // Render de servidor: reserva espaço para não haver salto de layout.
  if (mode === null || game === undefined) return <div className="min-h-64 md:min-h-40" aria-hidden="true" />;

  const shareText = `${match.teamA} vs ${match.teamB}, ${formatWeekday(match)}. Cada pessoa recebe um evento principal e um evento raro por ronda. Se acontecer, bebes o valor de golos indicado.`;
  const inProgress = game && !game.finished;
  const startLabel = mode === "pre" ? "Criar jogo" : mode === "post" ? "Jogar mesmo assim" : "Começar";

  return (
    <>
      {mode === "pre" ? (
        <>
          {/* Mobile: preview dos desafios da R1 (no desktop está na coluna da direita) */}
          <div className="md:hidden">
            <ChallengePreview match={match} />
          </div>
        </>
      ) : (
        !inProgress && (
          <dl className="rise grid grid-cols-3 gap-2 border-y border-line py-3 text-center md:max-w-md md:py-5 md:text-left">
            {[
              [match.rounds.length, "rondas"],
              [totalChallenges(match), "desafios"],
              ["2–8", "jogadores"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl leading-none font-bold md:text-4xl">{value}</dd>
                <dd className="mt-1 text-sm text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        )
      )}
      {mode === "post" && !inProgress && (
        <p className="rise mt-5 text-muted">Este jogo já acabou. Ainda dá para jogar a repetição.</p>
      )}

      <div className="action-bar mt-4 flex flex-col gap-1 md:mt-8 md:max-w-sm">
        {inProgress ? (
          <>
            <a
              href="/jogo"
              className="btn btn-primary"
              onClick={() => track("game_resumed", { round: game.rounds.length })}
            >
              Continuar · Ronda {game.rounds.length}
            </a>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirmNew(true)}>
              Novo jogo
            </button>
          </>
        ) : (
          <>
            <a
              href="/jogo"
              className="btn btn-primary"
              onClick={() => {
                track("play_clicked", { mode });
                if (game?.finished) clearGame(match);
              }}
            >
              {startLabel}
            </a>
            <ShareButton text={shareText} label="Partilhar com o grupo" location="landing" variant="ghost" compact />
          </>
        )}
      </div>

      {confirmNew && game && (
        <ConfirmSheet
          title="Novo jogo?"
          body="Os eventos já sorteados perdem-se."
          confirmLabel="Começar novo jogo"
          onConfirm={() => {
            track("game_restarted", { round: game.rounds.length, from: "landing" });
            clearGame(match); // a UI atualiza logo (useGame reage ao storage)
            setConfirmNew(false);
            window.location.assign("/jogo"); // eslint-disable-line @next/next/no-location-assign-relative-destination -- ver nota no topo
          }}
          onCancel={() => setConfirmNew(false)}
        />
      )}
    </>
  );
}
