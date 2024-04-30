import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";

class Scene {
  run() {
    const app = new PIXI.Application({ antialias: true, resizeTo: window });

    // @ts-ignore
    window.document.body.appendChild(app.view);

    const graphics = new PIXI.Graphics();

    // Rectangle
    graphics.beginFill(0xde3249);
    graphics.drawRect(50, 50, 100, 100);
    graphics.endFill();
  }
}
export { Scene };
