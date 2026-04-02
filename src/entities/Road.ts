import { Container, Graphics } from "pixi.js";
import {
  TOTAL_LANES,
  SIDEWALK_W,
  LANE_W,
  GAME_H,
  FINISH_X,
  ROAD_COLOR,
  SIDEWALK_COLOR,
  BRICK_COLOR,
  DIVIDER_COLOR,
} from "../config/constants";

export class Road extends Container {
  constructor() {
    super();
    this.drawRoadBackground();
    this.drawDividers();
    this.drawSidewalk(0);
    this.drawSidewalk(FINISH_X);
  }

  private drawRoadBackground(): void {
    const bg = new Graphics();
    bg.rect(SIDEWALK_W, 0, TOTAL_LANES * LANE_W, GAME_H).fill(ROAD_COLOR);
    this.addChild(bg);
  }

  private drawDividers(): void {
    const g = new Graphics();
    for (let i = 0; i <= TOTAL_LANES; i++) {
      const x = SIDEWALK_W + i * LANE_W;
      for (let y = 0; y < GAME_H; y += 28) {
        g.moveTo(x, y);
        g.lineTo(x, y + 16);
      }
    }
    g.stroke({ color: DIVIDER_COLOR, width: 2, alpha: 0.35 });
    this.addChild(g);
  }

  private drawSidewalk(x: number): void {
    const sw = new Graphics();
    sw.rect(x, 0, SIDEWALK_W, GAME_H).fill(SIDEWALK_COLOR);
    this.addChild(sw);

    const bricks = new Graphics();
    for (let y = 0; y < GAME_H; y += 18) {
      bricks.moveTo(x, y);
      bricks.lineTo(x + SIDEWALK_W, y);
    }
    bricks.stroke({ color: BRICK_COLOR, width: 1 });
    this.addChild(bricks);
  }
}
