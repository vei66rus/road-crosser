import { Container, Graphics, Text } from "pixi.js";
import {
  VIEWPORT_W,
  LANE_Y,
  COIN_FILL,
  COIN_STROKE,
  BADGE_BG,
} from "../config/constants";
import { laneCenterX } from "../utils/math";
import { SIDEWALK_W, LANE_W } from "../config/constants";

export class HUD {
  readonly statusText: Text;
  private coin: Graphics;
  private badge: Graphics;
  private badgeText: Text;

  constructor(screenLayer: Container, worldLayer: Container) {
    this.coin = new Graphics();
    this.coin
      .circle(0, 0, 16)
      .fill(COIN_FILL)
      .stroke({ color: COIN_STROKE, width: 2 });
    this.coin.visible = false;
    worldLayer.addChild(this.coin);

    this.badge = new Graphics();
    this.badge.roundRect(-26, -11, 52, 22, 5).fill(BADGE_BG);
    this.badge.visible = false;
    worldLayer.addChild(this.badge);

    this.badgeText = new Text({
      text: "",
      style: {
        fontSize: 11,
        fill: 0xffffff,
        fontFamily: "Arial",
        fontWeight: "bold",
      },
    });
    this.badgeText.anchor.set(0.5);
    this.badgeText.visible = false;
    worldLayer.addChild(this.badgeText);

    this.statusText = new Text({
      text: "",
      style: {
        fontSize: 30,
        fill: 0xffffff,
        fontFamily: "Arial",
        fontWeight: "bold",
      },
    });
    this.statusText.anchor.set(0.5);
    this.statusText.x = VIEWPORT_W / 2;
    this.statusText.y = 50;
    this.statusText.visible = false;
    screenLayer.addChild(this.statusText);
  }

  showCoinAndBadge(laneIndex: number, multiplierText: string): void {
    const cx = laneCenterX(laneIndex, SIDEWALK_W, LANE_W);
    this.coin.x = cx;
    this.coin.y = LANE_Y - 38;
    this.coin.visible = true;
    this.badge.x = cx;
    this.badge.y = LANE_Y + 50;
    this.badge.visible = true;
    this.badgeText.text = multiplierText;
    this.badgeText.x = cx;
    this.badgeText.y = LANE_Y + 50;
    this.badgeText.visible = true;
  }

  hideCoinAndBadge(): void {
    this.coin.visible = false;
    this.badge.visible = false;
    this.badgeText.visible = false;
  }

  showStatus(text: string, color: number): void {
    this.statusText.text = text;
    this.statusText.style.fill = color;
    this.statusText.visible = true;
  }

  hideStatus(): void {
    this.statusText.visible = false;
  }
}
