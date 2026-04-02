import { Application, Container } from "pixi.js";
import { VIEWPORT_W, GAME_H } from "./config/constants";
import { GameEngine } from "./core/GameEngine";

(async () => {
  const app = new Application();
  await app.init({ background: "#3a3a3a", width: VIEWPORT_W, height: GAME_H });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const world = new Container();
  app.stage.addChild(world);

  new GameEngine(app, world);
})();
