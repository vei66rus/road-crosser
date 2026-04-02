import type { Difficulty, GameState } from "../config/difficulty";
import { round2 } from "../utils/math";

export interface UICallbacks {
  onBetChange: (bet: number) => void;
  onDifficultyChange: (diff: Difficulty) => void;
  onPlay: () => void;
  onCashOut: () => void;
}

export class UIBridge {
  constructor(callbacks: UICallbacks) {
    document.querySelectorAll(".bet-btn").forEach((b) => {
      b.addEventListener("click", () => {
        callbacks.onBetChange(
          parseFloat((b as HTMLButtonElement).dataset.bet!),
        );
      });
    });

    document.querySelectorAll(".diff-btn").forEach((b) => {
      b.addEventListener("click", () => {
        callbacks.onDifficultyChange(
          (b as HTMLButtonElement).dataset.diff as Difficulty,
        );
      });
    });

    document
      .getElementById("btn-play")
      ?.addEventListener("click", callbacks.onPlay);
    document
      .getElementById("btn-cashout")
      ?.addEventListener("click", callbacks.onCashOut);
  }

  sync(
    state: GameState,
    balance: number,
    bet: number,
    difficulty: Difficulty,
    currentMultiplier: number,
    currentLane: number,
  ): void {
    const balEl = document.getElementById("balance-value");
    if (balEl) balEl.textContent = balance.toFixed(2);

    const betEl = document.getElementById("bet-display");
    if (betEl) betEl.textContent = bet.toString();

    const isPlaying = state === "playing";
    const playBtn = document.getElementById(
      "btn-play",
    ) as HTMLButtonElement | null;
    const cashoutBtn = document.getElementById(
      "btn-cashout",
    ) as HTMLButtonElement | null;

    if (playBtn && cashoutBtn) {
      if (isPlaying) {
        playBtn.style.display = "none";
        cashoutBtn.style.display = "flex";
        const winAmount = currentLane > 0 ? round2(bet * currentMultiplier) : 0;
        cashoutBtn.innerHTML = "CASH OUT<br>" + winAmount.toFixed(2) + " USD";
      } else {
        playBtn.style.display = "flex";
        cashoutBtn.style.display = "none";
      }
    }

    document.querySelectorAll(".bet-btn").forEach((b) => {
      const el = b as HTMLButtonElement;
      el.classList.toggle("active", parseFloat(el.dataset.bet!) === bet);
      el.disabled = isPlaying;
    });

    document.querySelectorAll(".diff-btn").forEach((b) => {
      const el = b as HTMLButtonElement;
      el.classList.toggle("active", el.dataset.diff === difficulty);
      el.disabled = isPlaying;
    });
  }
}
