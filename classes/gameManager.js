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

    this.mousePosition = { x: 0, y: 0 };
    this.canvas.addEventListener("mousemove", (e) => {
      this.mousePosition = this.getMousePosition(e.clientX, e.clientY);
    });

    this.lastBrushArea = null;

    if (!navigator.getGamepads) {
      console.log("Gamepads are unsupported!");
    } else {
      console.log(navigator.getGamepads());
      window.addEventListener("gamepadconnected", (e) => {
        console.log(e);
        console.log(navigator.getGamepads());
      });
    }

    this.heightmap = new Heightmap(200, 300, 10);
    this.heightmap.addWater(50, 50, 10, 2);
    this.heightmap.display(this.ctx);

    this.brush = new Brush(this.heightmap, "black", 5);
    this.brush.radius = 50;

    this.lastTimeStamp = Date.now();
    this.update();
  }

  update() {
    const deltaTime = (Date.now() - this.lastTimeStamp) / 1000;
    this.lastTimeStamp = Date.now();

    this.heightmap.display(this.ctx);

    this.clear(this.lastBrushArea);
    this.lastBrushArea = this.brush.preview(
      this.ctx,
      this.mousePosition.x,
      this.mousePosition.y
    );

    requestAnimationFrame(() => this.update());
  }

  /**
   *
   * @param {number} clientX
   * @param {number} clientY
   */
  getMousePosition(clientX, clientY) {
    const size = this.rect;
    return {
      x: clientX - size.left,
      y: clientY - size.top,
    };
  }

  resizeCanvas() {
    const size = this.rect;
    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  clear(area) {
    if (area != null) {
      this.ctx.clearRect(area.x, area.y, area.w, area.h);
    }
  }
  clearAll() {
    const size = this.rect;
    this.ctx.clearRect(0, 0, size.width, size.height);
  }

  get rect() {
    return this.canvas.getBoundingClientRect();
  }

  saveMap() {
    this.heightmap.saveMap();
  }
}
