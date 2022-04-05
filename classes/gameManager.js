import { Heightmap } from "./heightMap.js";
import { Brush } from "./brush.js";

export class GameManager {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resizeCanvas();
    window.addEventListener("resize", (e) => this.resizeCanvas());

    if (!navigator.getGamepads) {
      console.log("Gamepads are unsupported!");
    } else {
      console.log(navigator.getGamepads());
      window.addEventListener("gamepadconnected", (e) => {
        console.log(e);
        console.log(navigator.getGamepads());
      });
    }

    this.lastTimeStamp = Date.now();

    this.heightmap = new Heightmap(200, 300, 10);

    this.update();
  }

  update() {
    const deltaTime = (Date.now() - this.lastTimeStamp) / 1000;
    this.lastTimeStamp = Date.now();

    this.clear();

    this.heightmap.display(this.ctx);

    requestAnimationFrame(() => this.update());
  }

  resizeCanvas() {
    const size = this.rect;
    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  clear() {
    const size = this.rect;
    this.ctx.clearRect(0, 0, size.width, size.height);
  }

  get rect() {
    return this.canvas.getBoundingClientRect();
  }
}
