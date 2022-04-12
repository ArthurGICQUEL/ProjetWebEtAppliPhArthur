import { Heightmap } from "./heightMap.js";

export class Brush {
  /**
   * 
   * @param {Heightmap} heightmap 
   * @param {String} previewColor 
   * @param {Number} strength
   * @param {Number} lineWidth
   */
  constructor(heightmap, previewColor, strength, lineWidth = 10) {
    this.heightmap = heightmap;
    this.setup(previewColor, lineWidth);
    this.strength = strength
    this._radius = 0;
    this.shiftDown = false;

    window.addEventListener("keydown", (e) => {
      this.shiftDown = e.shiftKey;
    });
    window.addEventListener("keyup", (e) => {
      this.shiftDown = e.shiftKey;
    });
  }

  setup(previewColor, lineWidth) {
    this.previewColor = previewColor;
    this.lineWidth = lineWidth;
  }

  /**
   * 
   * @param {Number} radius 
   * @param {Number} maxRadius 
   * @param {Number} maxDepth 
   * @returns 
   */
  getCurve(radius, maxRadius, maxDepth) {
    return maxDepth * 0.5 * (1 + Math.cos(Math.PI * radius / maxRadius));
  }

  getHeight(deltaTime) {
    return this.strength * deltaTime;
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
    return {
      x: x - (this.radius + Math.round(this.lineWidth * 0.5) + 1), 
      y: y - (this.radius + Math.round(this.lineWidth * 0.5) + 1), 
      w: this.radius * 2 + this.lineWidth + 2, 
      h: this.radius * 2 + this.lineWidth + 2
    };
  }

  apply(x, y, depth) {
    const trueDepth = (this.shiftDown ? -1 : 1) * depth;
    this.heightmap.applyInRadius(x, y, this.radius, (x, y, r) => {
      this.heightmap.changeTerrainHeight(x, y, this.getCurve(r, this.radius, trueDepth));
    });

    console.log("Applied brush: " + (this.shiftDown ? "remove" : "add"));
  }

  get radius() {
    return this._radius;
  }
  set radius(val) {
    this._radius = val;
  }
}