import { Container, Graphics } from "pixi.js";
import {
  GAME_H,
  SIDEWALK_W,
  LANE_W,
  VISIBLE_LANES,
  TOTAL_LANES,
  MAX_TRAFFIC,
  TRAFFIC_SPAWN_INTERVAL,
  TRAFFIC_MIN_SPEED,
  TRAFFIC_MAX_SPEED,
  TRAFFIC_COLORS,
} from "../config/constants";
import { lighten, laneCenterX } from "../utils/math";

interface TrafficCar {
  gfx: Graphics;
  speed: number;
}

export class Traffic extends Container {
  private cars: TrafficCar[] = [];
  private timer = 0;
  private currentLane = 0;

  setCurrentLane(lane: number): void {
    this.currentLane = lane;
  }

  update(dt: number): void {
    this.timer += dt;

    if (this.timer > TRAFFIC_SPAWN_INTERVAL && this.cars.length < MAX_TRAFFIC) {
      this.timer = 0;
      this.spawn();
    }

    for (let i = this.cars.length - 1; i >= 0; i--) {
      const tc = this.cars[i];
      tc.gfx.y += tc.speed * dt;

      if (tc.gfx.y > GAME_H + 100) {
        this.removeChild(tc.gfx);
        tc.gfx.destroy();
        this.cars.splice(i, 1);
      }
    }
  }

  private spawn(): void {
    const color =
      TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)];
    const g = new Graphics();

    g.roundRect(-16, -28, 32, 56, 4).fill(color);
    g.roundRect(-12, -14, 24, 24, 3).fill(lighten(color));
    g.circle(-14, -26, 4).fill(0x333333);
    g.circle(14, -26, 4).fill(0x333333);
    g.circle(-14, 26, 4).fill(0x333333);
    g.circle(14, 26, 4).fill(0x333333);

    const camLane = Math.max(0, this.currentLane - 2);
    const randomLane =
      camLane + Math.floor(Math.random() * (VISIBLE_LANES + 4));
    g.x = laneCenterX(
      Math.min(randomLane, TOTAL_LANES - 1),
      SIDEWALK_W,
      LANE_W,
    );
    g.y = -60;
    g.alpha = 0.5;

    this.addChild(g);
    this.cars.push({
      gfx: g,
      speed:
        TRAFFIC_MIN_SPEED +
        Math.random() * (TRAFFIC_MAX_SPEED - TRAFFIC_MIN_SPEED),
    });
  }

  clear(): void {
    for (const tc of this.cars) {
      this.removeChild(tc.gfx);
      tc.gfx.destroy();
    }
    this.cars = [];
  }
}
