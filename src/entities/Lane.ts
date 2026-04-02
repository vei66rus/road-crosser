import { Container, Graphics, Text } from "pixi.js";
import {
  LUKE_R,
  LANE_Y,
  MANHOLE_FILL,
  MANHOLE_STROKE,
  MANHOLE_GRID,
  BARRIER_YELLOW,
  BARRIER_BLACK,
  BARRIER_POST,
} from "../config/constants";
import { lighten } from "../utils/math";
import type { LaneState } from "../config/difficulty";

export class Lane extends Container {
  private manhole: Graphics;
  private labelText: Text;
  private car: Graphics;
  private barrier: Graphics;
  private carColor: number;
  private onClick: () => void;
  private pulseActive = false;
  private pulseTime = 0;

  constructor(x: number, carColor: number, onClick: () => void) {
    super();
    this.x = x;
    this.carColor = carColor;
    this.onClick = onClick;

    this.barrier = this.createBarrier();
    this.car = this.createCar();
    this.manhole = this.createManhole();
    this.labelText = this.createLabel();
  }

  private createManhole(): Graphics {
    const g = new Graphics();
    this.drawManholeGraphics(g);
    g.y = LANE_Y;
    g.interactive = true;
    g.cursor = "pointer";
    g.on("pointerdown", () => this.onClick());
    this.addChild(g);
    return g;
  }

  private drawManholeGraphics(g: Graphics): void {
    g.clear();
    g.circle(0, 0, LUKE_R)
      .fill(MANHOLE_FILL)
      .stroke({ color: MANHOLE_STROKE, width: 3 });
    for (let y = -22; y <= 22; y += 8) {
      g.moveTo(-25, y);
      g.lineTo(25, y);
    }
    g.stroke({ color: MANHOLE_GRID, width: 2 });
  }

  private createCar(): Graphics {
    const g = new Graphics();
    g.roundRect(-22, -35, 44, 70, 6).fill(this.carColor);
    g.roundRect(-16, -18, 32, 30, 4).fill(lighten(this.carColor));
    g.circle(-18, -32, 6).fill(0x333333);
    g.circle(18, -32, 6).fill(0x333333);
    g.circle(-18, 32, 6).fill(0x333333);
    g.circle(18, 32, 6).fill(0x333333);
    g.rect(-14, -38, 8, 4).fill(0xf1c40f);
    g.rect(6, -38, 8, 4).fill(0xf1c40f);
    g.y = LANE_Y;
    g.visible = false;
    this.addChild(g);
    return g;
  }

  private createBarrier(): Graphics {
    const g = new Graphics();
    g.rect(-28, -10, 5, 24).fill(BARRIER_POST);
    g.rect(23, -10, 5, 24).fill(BARRIER_POST);
    for (let s = 0; s < 5; s++) {
      g.rect(-23 + s * 10, -6, 10, 12).fill(
        s % 2 === 0 ? BARRIER_YELLOW : BARRIER_BLACK,
      );
    }
    g.y = LANE_Y - 55;
    g.visible = false;
    this.addChild(g);
    return g;
  }

  private createLabel(): Text {
    const t = new Text({
      text: "",
      style: {
        fontSize: 14,
        fill: 0xcccccc,
        fontFamily: "Arial",
        fontWeight: "bold",
      },
    });
    t.anchor.set(0.5);
    t.y = LANE_Y;
    this.addChild(t);
    return t;
  }

  setMultiplierText(text: string): void {
    this.labelText.text = text;
  }

  applyState(laneState: LaneState, isNextClickable: boolean): void {
    this.pulseActive = isNextClickable;

    if (laneState === "hidden") {
      this.drawManholeGraphics(this.manhole);
      this.manhole.visible = true;
      this.manhole.interactive = isNextClickable;
      this.manhole.cursor = isNextClickable ? "pointer" : "default";
      this.manhole.alpha = isNextClickable ? 1.0 : 0.7;
      this.labelText.visible = true;
      this.car.visible = false;
      this.barrier.visible = false;
    } else if (laneState === "safe") {
      this.manhole.visible = false;
      this.manhole.interactive = false;
      this.labelText.visible = false;
      this.car.visible = false;
      this.barrier.visible = true;
    } else {
      this.manhole.visible = false;
      this.manhole.interactive = false;
      this.labelText.visible = false;
      this.car.visible = true;
      this.barrier.visible = false;
    }
  }

  hideManhole(): void {
    this.pulseActive = false;
    this.manhole.visible = false;
    this.manhole.interactive = false;
    this.labelText.visible = false;
  }

  update(dt: number): void {
    if (!this.pulseActive) return;
    this.pulseTime += dt * 0.05;
    const pulse = 1 + Math.sin(this.pulseTime * Math.PI * 2) * 0.06;
    this.manhole.scale.set(pulse);
  }
}
