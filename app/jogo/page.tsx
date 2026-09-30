"use client";

import { CURRENT_MATCH as match } from "@/data/matches";
import { useGame } from "@/lib/storage";
import { PlayerSetup } from "@/components/PlayerSetup";
import { GameScreen } from "@/components/GameScreen";
import { FinalScreen } from "@/components/FinalScreen";

// Pode ser criado a qualquer altura (também antes do jogo).
// As rondas 2–4 é que só abrem perto da hora certa: ver GameScreen.
export default function GamePage() {
  const game = useGame(match);

  if (game === undefined) return <main className="flex-1" />;
  if (game?.finished) return <FinalScreen match={match} game={game} />;
  if (game) return <GameScreen match={match} game={game} />;
  return <PlayerSetup match={match} />;
}
