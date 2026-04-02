import { TOTAL_LANES } from "./constants";

export type Difficulty = "easy" | "medium" | "hard" | "hardcore";
export type GameState = "idle" | "playing" | "gameOver" | "cashedOut";
export type LaneState = "hidden" | "safe" | "danger";

export const DANGER_CHANCE: Record<Difficulty, number> = {
  easy: 0.08,
  medium: 0.18,
  hard: 0.3,
  hardcore: 0.45,
};

const MULT_STEP: Record<Difficulty, number> = {
  easy: 1.03,
  medium: 1.06,
  hard: 1.1,
  hardcore: 1.15,
};

export function generateMultipliers(diff: Difficulty): number[] {
  const step = MULT_STEP[diff];
  return Array.from({ length: TOTAL_LANES }, (_, i) =>
    parseFloat(Math.pow(step, i + 1).toFixed(2)),
  );
}

export function generateDangers(diff: Difficulty): boolean[] {
  const chance = DANGER_CHANCE[diff];
  return Array.from({ length: TOTAL_LANES }, () => Math.random() < chance);
}
