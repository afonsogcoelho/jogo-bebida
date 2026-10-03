export interface Challenge {
  /** Único dentro do jogo, ex.: "r1-canto-portugal" */
  id: string;
  text: string;
  /** Condição/esclarecimento mostrado em pequeno, ex.: "Se não jogar, vale para…" */
  note?: string;
}

export interface Round {
  id: number;
  /** Intervalo em que os desafios da ronda contam, ex.: "0'–22'" */
  label: string;
  /** Minuto de jogo em que a ronda começa (sem contar intervalo) */
  startMinute: number;
  /** Os 5 desafios principais. Com 2–5 jogadores só se sorteia daqui. */
  challenges: Challenge[];
  /** Entram só quando há mais jogadores do que desafios principais (6–8). */
  alternatives: Challenge[];
}

export interface Match {
  slug: string;
  teamA: string;
  teamB: string;
  competition: string;
  venue: string;
  /** ISO com offset de Lisboa, ex.: "2026-10-01T19:45:00+01:00" */
  kickoff: string;
  rounds: Round[];
  /** Pool de eventos raros, comum a todas as rondas. Nunca aparece na landing. */
  rareEvents: Challenge[];
}

export interface Player {
  id: string;
  name: string;
}

export interface PlayerPick {
  mainChallengeId: string;
  rareEventId: string;
}

export interface RoundAssignment {
  roundId: number;
  openedAt: number;
  picks: Record<string, PlayerPick>;
}

export interface GameState {
  version: 3;
  matchSlug: string;
  players: Player[];
  /** A última entrada é a ronda atual */
  rounds: RoundAssignment[];
  finished: boolean;
  createdAt: number;
}

export type MatchMode = "pre" | "game" | "post";
