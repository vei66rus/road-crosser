import { Container } from "pixi.js";
import {
  TOTAL_LANES,
  SIDEWALK_W,
  LANE_W,
  CAR_COLORS,
} from "../config/constants";
import { Lane } from "./Lane";
import type { LaneState } from "../config/difficulty";
import { laneCenterX } from "../utils/math";

export class LaneManager extends Container {
  private lanes: Lane[] = [];

  constructor(onLaneClick: (index: number) => void) {
    super();

    for (let i = 0; i < TOTAL_LANES; i++) {
      const cx = laneCenterX(i, SIDEWALK_W, LANE_W);
      const lane = new Lane(cx, CAR_COLORS[i % CAR_COLORS.length], () =>
        onLaneClick(i),
      );
      this.addChild(lane);
      this.lanes.push(lane);
    }
  }

  updateMultipliers(multipliers: number[]): void {
    for (let i = 0; i < TOTAL_LANES; i++) {
      this.lanes[i].setMultiplierText(multipliers[i].toFixed(2) + "x");
    }
  }

  updateStates(
    states: LaneState[],
    currentLane: number,
    isPlaying: boolean,
    isAnimating: boolean,
  ): void {
    for (let i = 0; i < TOTAL_LANES; i++) {
      const isNext = isPlaying && i === currentLane && !isAnimating;
      this.lanes[i].applyState(states[i], isNext);
    }
  }

  hideLane(index: number): void {
    this.lanes[index].hideManhole();
  }

  revealDanger(index: number): void {
    const states: LaneState[] = new Array(TOTAL_LANES).fill("hidden");
    states[index] = "danger";
    this.lanes[index].applyState("danger", false);
  }

  update(dt: number): void {
    for (const lane of this.lanes) {
      lane.update(dt);
    }
  }
}
