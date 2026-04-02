import {
  TOTAL_LANES,
  SIDEWALK_W,
  LANE_W,
  VISIBLE_LANES,
  FINISH_X,
  CAMERA_LERP,
  CAMERA_SCROLL_START,
  DEFAULT_BALANCE,
} from "../config/constants";
import {
  type Difficulty,
  type GameState,
  type LaneState,
  generateMultipliers,
  generateDangers,
} from "../config/difficulty";
import { round2, laneCenterX } from "../utils/math";

import type { Application, Container } from "pixi.js";
import { Road } from "../entities/Road";
import { Chicken } from "../entities/Chicken";
import { LaneManager } from "../entities/LaneManager";
import { Traffic } from "../entities/Traffic";
import { HUD } from "../ui/HUD";
import { UIBridge } from "../ui/UIBridge";

export class GameEngine {
  private world: Container;

  private road: Road;
  private chicken: Chicken;
  private laneManager: LaneManager;
  private traffic: Traffic;
  private hud: HUD;
  private ui: UIBridge;

  private state: GameState = "idle";
  private balance = DEFAULT_BALANCE;
  private bet = 1;
  private difficulty: Difficulty = "easy";
  private currentLane = 0;
  private currentMultiplier = 1;
  private dangers: boolean[] = [];
  private multipliers: number[] = [];
  private laneStates: LaneState[] = [];
  private targetWorldX = 0;

  constructor(app: Application, world: Container) {
    this.world = world;

    this.road = new Road();
    world.addChild(this.road);

    this.traffic = new Traffic();
    world.addChild(this.traffic);

    this.laneManager = new LaneManager((i) => this.onLaneClick(i));
    world.addChild(this.laneManager);

    this.chicken = new Chicken();
    this.chicken.x = SIDEWALK_W / 2;
    world.addChild(this.chicken);

    this.hud = new HUD(app.stage, world);

    this.ui = new UIBridge({
      onBetChange: (b) => this.setBet(b),
      onDifficultyChange: (d) => this.setDifficulty(d),
      onPlay: () => this.start(),
      onCashOut: () => this.cashOut(),
    });

    app.ticker.add((ticker) => this.update(ticker.deltaTime));
    this.reset();
  }

  private update(dt: number): void {
    if (Math.abs(this.world.x - this.targetWorldX) > 0.5) {
      this.world.x += (this.targetWorldX - this.world.x) * CAMERA_LERP;
    } else {
      this.world.x = this.targetWorldX;
    }

    this.chicken.update(dt);
    this.traffic.update(dt);
  }

  private getTargetWorldX(): number {
    const scrollLanes =
      this.currentLane <= CAMERA_SCROLL_START
        ? 0
        : this.currentLane - CAMERA_SCROLL_START;
    const maxScroll = TOTAL_LANES + 1 - VISIBLE_LANES;
    return -Math.min(scrollLanes, maxScroll) * LANE_W;
  }

  private syncAll(): void {
    this.laneManager.updateStates(
      this.laneStates,
      this.currentLane,
      this.state === "playing",
      this.chicken.isJumping,
    );

    const showBadge =
      (this.state === "playing" || this.state === "cashedOut") &&
      this.currentLane > 0 &&
      !this.chicken.isJumping;

    if (showBadge) {
      this.hud.showCoinAndBadge(
        this.currentLane - 1,
        this.multipliers[this.currentLane - 1].toFixed(2) + "x",
      );
    } else {
      this.hud.hideCoinAndBadge();
    }

    this.ui.sync(
      this.state,
      this.balance,
      this.bet,
      this.difficulty,
      this.currentMultiplier,
      this.currentLane,
    );
  }

  private reset(): void {
    this.state = "idle";
    this.currentLane = 0;
    this.currentMultiplier = 1;
    this.dangers = [];
    this.laneStates = new Array(TOTAL_LANES).fill("hidden");
    this.multipliers = generateMultipliers(this.difficulty);
    this.hud.hideStatus();
    this.hud.hideCoinAndBadge();
    this.chicken.resetPosition(SIDEWALK_W / 2);
    this.laneManager.updateMultipliers(this.multipliers);
    this.targetWorldX = this.getTargetWorldX();
    this.world.x = this.targetWorldX;
    this.traffic.setCurrentLane(0);
    this.syncAll();
  }

  private start(): void {
    if (this.state === "playing") return;
    if (this.balance < this.bet) return;

    this.balance = round2(this.balance - this.bet);
    this.state = "playing";
    this.currentLane = 0;
    this.currentMultiplier = 1;
    this.laneStates = new Array(TOTAL_LANES).fill("hidden");
    this.multipliers = generateMultipliers(this.difficulty);
    this.dangers = generateDangers(this.difficulty);

    this.hud.hideStatus();
    this.hud.hideCoinAndBadge();
    this.chicken.resetPosition(SIDEWALK_W / 2);
    this.laneManager.updateMultipliers(this.multipliers);
    this.targetWorldX = this.getTargetWorldX();
    this.world.x = this.targetWorldX;
    this.traffic.setCurrentLane(0);
    this.syncAll();
  }

  private onLaneClick(i: number): void {
    if (this.state !== "playing") return;
    if (i !== this.currentLane) return;
    if (this.chicken.isJumping) return;

    this.laneManager.hideLane(i);

    const isDanger = this.dangers[i];
    const targetX = laneCenterX(i, SIDEWALK_W, LANE_W);

    this.chicken.jumpTo(targetX, () => this.onLanded(i, isDanger));
  }

  private onLanded(lane: number, isDanger: boolean): void {
    if (isDanger) {
      this.state = "gameOver";
      this.laneStates[lane] = "danger";
      this.chicken.drawSquished();
      this.hud.showStatus("GAME OVER", 0xe74c3c);
      this.syncAll();
      return;
    }

    this.laneStates[lane] = "safe";
    this.currentMultiplier = this.multipliers[lane];
    this.currentLane++;
    this.traffic.setCurrentLane(this.currentLane);
    this.targetWorldX = this.getTargetWorldX();

    if (this.currentLane >= TOTAL_LANES) {
      const winnings = round2(this.bet * this.currentMultiplier);
      this.balance = round2(this.balance + winnings);
      this.state = "cashedOut";
      this.hud.showStatus("YOU WIN! +$" + winnings.toFixed(2), 0x4caf50);
      this.syncAll();
      return;
    }

    this.syncAll();
  }

  private cashOut(): void {
    if (
      this.state !== "playing" ||
      this.currentLane === 0 ||
      this.chicken.isJumping
    )
      return;

    const winnings = round2(this.bet * this.currentMultiplier);
    this.balance = round2(this.balance + winnings);
    this.state = "cashedOut";
    this.hud.showStatus("CASH OUT +$" + winnings.toFixed(2), 0x4caf50);

    for (let j = this.currentLane; j < TOTAL_LANES; j++) {
      if (this.dangers[j]) {
        this.laneStates[j] = "danger";
        break;
      }
    }

    this.syncAll();
  }

  private setBet(value: number): void {
    if (this.state === "playing") return;
    this.bet = value;
    this.reset();
  }

  private setDifficulty(value: Difficulty): void {
    if (this.state === "playing") return;
    this.difficulty = value;
    this.reset();
  }
}
