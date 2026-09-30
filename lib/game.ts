import type { Challenge, GameState, Match, Player, PlayerPick, Round } from "@/types/game";

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;
const MIN_TIMES = 3;
const MAX_TIMES = 6;

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function defaultName(index: number) {
  return `Jogador ${index + 1}`;
}

export function createGame(match: Match, names: string[], now = Date.now()): GameState {
  const players: Player[] = names.map((name, i) => ({
    id: `p${i + 1}`,
    name: name.trim() || defaultName(i),
  }));
  const game: GameState = {
    version: 3,
    matchSlug: match.slug,
    players,
    rounds: [],
    finished: false,
    createdAt: now,
  };
  return openNextRound(game, match, now);
}

/**
 * Sorteia a próxima ronda: 1 desafio principal + 1 evento raro por jogador.
 * Chamar só a partir de uma ação do utilizador. O resultado é gravado logo a seguir.
 */
export function openNextRound(game: GameState, match: Match, now = Date.now()): GameState {
  const round = match.rounds[game.rounds.length];
  if (!round) return game;
  const n = game.players.length;
  const mains = drawPool(round, n);
  const rares = drawRareEvents(match, n);
  const picks: Record<string, PlayerPick> = Object.fromEntries(
    game.players.map((p, i) => [p.id, { mainChallengeId: mains[i].id, rareEventId: rares[i].id }]),
  );
  return {
    ...game,
    rounds: [...game.rounds, { roundId: round.id, openedAt: now, picks }],
  };
}

/**
 * N desafios principais únicos para a ronda, já baralhados.
 * Até 5 jogadores: só desafios principais. Acima disso: todos os principais + as alternativas necessárias.
 */
export function drawPool(round: Round, count: number): Challenge[] {
  if (count <= round.challenges.length) return shuffle(round.challenges).slice(0, count);
  const extra = shuffle(round.alternatives).slice(0, count - round.challenges.length);
  return shuffle([...round.challenges, ...extra]);
}

/** N eventos raros, únicos dentro da ronda enquanto o pool chegar. */
export function drawRareEvents(match: Match, count: number): Challenge[] {
  const result: Challenge[] = [];
  while (result.length < count) result.push(...shuffle(match.rareEvents));
  return result.slice(0, count);
}

/** Todos os desafios principais possíveis da ronda (para a animação do sorteio). */
export function roundPool(round: Round): Challenge[] {
  return [...round.challenges, ...round.alternatives];
}

export function teaserChallenges(match: Match): Challenge[] {
  return match.rounds[0].challenges;
}

export function finishGame(game: GameState): GameState {
  return { ...game, finished: true };
}

export function findChallenge(match: Match, id: string | undefined): Challenge | undefined {
  for (const round of match.rounds) {
    const found = roundPool(round).find((c) => c.id === id);
    if (found) return found;
  }
  return undefined;
}

export function findRareEvent(match: Match, id: string | undefined): Challenge | undefined {
  return match.rareEvents.find((c) => c.id === id);
}

export function timesLabel(times: number) {
  return `${times}x`;
}

/** Desafios principais + alternativas (os raros não contam: são surpresa). */
export function totalChallenges(match: Match) {
  return match.rounds.reduce((sum, r) => sum + roundPool(r).length, 0);
}

/** Garante que um GameState guardado ainda bate certo com o conteúdo atual. */
export function isValidGame(value: unknown, match: Match): value is GameState {
  if (!value || typeof value !== "object") return false;
  const g = value as GameState;
  if (g.version !== 3 || g.matchSlug !== match.slug) return false;
  if (!Array.isArray(g.players) || !Array.isArray(g.rounds)) return false;
  if (g.players.length < MIN_PLAYERS || g.players.length > MAX_PLAYERS) return false;
  if (g.rounds.length < 1 || g.rounds.length > match.rounds.length) return false;
  return g.rounds.every((r) =>
    g.players.every((p) => {
      const pick = r.picks?.[p.id];
      return !!findChallenge(match, pick?.mainChallengeId) && !!findRareEvent(match, pick?.rareEventId);
    }),
  );
}

export function assertValidMatch(match: Match) {
  const ids = new Set<string>();
  const all = [...match.rounds.flatMap(roundPool), ...match.rareEvents];
  for (const round of match.rounds) {
    if (roundPool(round).length < MAX_PLAYERS) {
      throw new Error(`${match.slug}: ronda ${round.id} precisa de ${MAX_PLAYERS}+ desafios`);
    }
  }
  if (match.rareEvents.length < MAX_PLAYERS) {
    throw new Error(`${match.slug}: precisa de ${MAX_PLAYERS}+ eventos raros`);
  }
  for (const c of all) {
    if (ids.has(c.id)) throw new Error(`${match.slug}: id repetido ${c.id}`);
    if (c.times < MIN_TIMES || c.times > MAX_TIMES) throw new Error(`${match.slug}: ${c.id} fora de 3x–6x`);
    ids.add(c.id);
  }
}
