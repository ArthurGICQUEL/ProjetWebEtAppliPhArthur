import { Heightmap } from "./heightMap.js";

export class Brush {
  /**
   * 
   * @param {Heightmap} heightmap 
   * @param {String} previewColor 
   * @param {Number} lineWidth 
   */
  constructor(heightmap, previewColor, lineWidth = 10) {
    this.heightmap = heightmap;
    this.setup(previewColor, lineWidth);
    this._radius = 0;
    this.shiftDown = false;
    window.addEventListener("keydown", (e) => {
      if(e.shiftKey) this.shiftDown = true;
    });
    window.addEventListener("keyup", (e) => {
      if(e.shiftKey) this.shiftDown = false;
    });
  }

  setup(previewColor, lineWidth) {
    this.previewColor = previewColor;
    this.lineWidth = lineWidth;
  }

  /**
   * 
   * @param {Number} n 
   * @param {Number} height 
   * @param {Number} radius 
   * @returns 
   */
  getCurve(n, height, radius) {
    return height * Math.cos(Math.PI * n / radius);
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {Number} x 
   * @param {Number} y 
   * @returns 
   */
  preview(ctx, x, y) {
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.previewColor;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    return {x: x - (this.radius + this.lineWidth * 0.5), y: y - (this.radius + this.lineWidth * 0.5), w: this.radius * 2 + this.lineWidth, h: this.radius * 2 + this.lineWidth};
  }

  apply() {
    console.log("Applied brush: " + (this.shiftDown ? "remove" : "add"));
  }

  get radius() {
    return this._radius;
  }
  set radius(val) {
    this._radius = val;
  }
}