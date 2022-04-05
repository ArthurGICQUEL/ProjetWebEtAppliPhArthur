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
    window.addEventListener("resize", (e) => {
      this.resizeCanvas();
      //this.heightmap.display(this.ctx);
    });

    this.mousePosition = null;
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

    const size = this.rect;
    this.heightmap = new Heightmap(size.height, size.width, 10);
    this.heightmap.addWater(50, 50, 20, 2);
    //console.log(this.heightmap);

    this.brush = new Brush(this.heightmap, "black", 5);
    this.brush.radius = 50;

    this.lastTimeStamp = Date.now();
    this.update();
  }

  update() {
    const deltaTime = (Date.now() - this.lastTimeStamp) / 1000;
    this.lastTimeStamp = Date.now();

    if(this.lastBrushArea !== null) {
      this.clear(this.lastBrushArea);
      this.displayMap(this.lastBrushArea);
    }

    if(this.mousePosition !== null) {
      this.lastBrushArea = this.brush.preview(
        this.ctx,
        this.mousePosition.x,
        this.mousePosition.y
      );
    }

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

  displayMap(area) {
    this.heightmap.displayLimited(this.ctx, area.x, area.y, area.w, area.h);
  }

  resizeCanvas() {
    const size = this.rect;
    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  clear(area) {
    this.ctx.clearRect(area.x, area.y, area.w, area.h);
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
