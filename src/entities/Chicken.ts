import { Graphics } from "pixi.js";
import {
  LANE_Y,
  JUMP_SPEED,
  JUMP_HEIGHT,
  JUMP_SCALE_BOOST,
} from "../config/constants";

export class Chicken extends Graphics {
  private jumping = false;
  private jumpProgress = 0;
  private startX = 0;
  private endX = 0;
  private baseY = LANE_Y;
  private onLandCallback: (() => void) | null = null;

  constructor() {
    super();
    this.y = LANE_Y;
    this.drawNormal();
  }

  drawNormal(): void {
    this.clear();
    this.rect(-18, -35, 36, 70).fill(0xffffff);
    this.circle(-6, -20, 3).fill(0x000000);
    this.circle(6, -20, 3).fill(0x000000);
    this.moveTo(0, -14);
    this.lineTo(6, -8);
    this.lineTo(-6, -8);
    this.closePath();
    this.fill(0xffa500);
    this.circle(0, -36, 5).fill(0xff0000);
    this.circle(-5, -34, 4).fill(0xff0000);
    this.circle(5, -34, 4).fill(0xff0000);
  }

  drawSquished(): void {
    this.clear();
    this.ellipse(0, 0, 30, 8).fill(0xdddddd);
    this.ellipse(0, 0, 30, 8).stroke({ color: 0xaaaaaa, width: 2 });
    this.moveTo(-10, -3);
    this.lineTo(-5, 2);
    this.moveTo(-5, -3);
    this.lineTo(-10, 2);
    this.moveTo(5, -3);
    this.lineTo(10, 2);
    this.moveTo(10, -3);
    this.lineTo(5, 2);
    this.stroke({ color: 0x666666, width: 2 });
  }

  jumpTo(targetX: number, onLand: () => void): void {
    this.jumping = true;
    this.jumpProgress = 0;
    this.startX = this.x;
    this.endX = targetX;
    this.baseY = LANE_Y;
    this.onLandCallback = onLand;
  }

  get isJumping(): boolean {
    return this.jumping;
  }

  update(dt: number): void {
    if (!this.jumping) return;

    this.jumpProgress += JUMP_SPEED * dt;

    if (this.jumpProgress >= 1) {
      this.jumping = false;
      this.x = this.endX;
      this.y = this.baseY;
      this.scale.set(1);
      this.onLandCallback?.();
      this.onLandCallback = null;
      return;
    }

    const t = this.jumpProgress;
    this.x = this.startX + (this.endX - this.startX) * t;
    const arc = Math.sin(t * Math.PI);
    this.y = this.baseY - arc * JUMP_HEIGHT;
    this.scale.set(1 + arc * JUMP_SCALE_BOOST);
  }

  resetPosition(x: number): void {
    this.jumping = false;
    this.jumpProgress = 0;
    this.x = x;
    this.y = LANE_Y;
    this.scale.set(1);
    this.drawNormal();
  }
}
