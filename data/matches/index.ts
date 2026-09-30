import { portugalDinamarca } from "./portugal-dinamarca";
import { assertValidMatch } from "@/lib/game";

// Para um jogo novo: criar data/matches/<slug>.ts e trocar aqui.
export const CURRENT_MATCH = portugalDinamarca;

if (process.env.NODE_ENV !== "production") assertValidMatch(CURRENT_MATCH);
