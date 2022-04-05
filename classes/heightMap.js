const colors = ["#12522e", "#a88977"];
const waterColor = "#4287f5";

export class Heightmap {
  constructor(height, width, maxDepth) {
    this.pixelSize = 3;
    this.height = height * this.pixelSize;
    this.width = width * this.pixelSize;
    this.maxDepth = maxDepth;
    this.pixels = Array.from(Array(width), () =>
      Array(height).fill({ terrain: this.maxDepth / 2, water: 0 })
    );
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  display(ctx) {
    for (let x = 0; x < this.pixels.length; x++) {
      for (let y = 0; y < this.pixels[x].length; y++) {
        ctx.fillStyle =
          this.pixels[x][y].water > 0
            ? waterColor
            : this.lerpColor(
                colors[0],
                colors[1],
                this.pixels[x][y].terrain / this.maxDepth
              );
        ctx.fillRect(
          this.pixelSize * x,
          this.pixelSize * y,
          this.pixelSize,
          this.pixelSize
        );
      }
    }
  }

  waterBehavior() {
    for (let x = 0; x < this.pixels.length; x++) {
      for (let y = 0; y < this.pixels[x].length; y++) {
        let lowerPoints = this.getLowerPoints();
        if (lowerPoints.length == 0) return;
        lowerPoints[Math.random(0, lowerPoints.length)].water++;
      }
    }
  }

  addWater(x, y, radius, depth) {
    for (let i = -radius; i < radius; i++) {
      for (let j = -radius; j < radius; j++) {
        if (i * i + j * j <= radius * radius) {
          this.pixels[x + i][y + j].water += depth;
        }
      }
    }
  }

  getLowerPoints(x, y) {
    let result = [];

    if (
      pixels[x - 1][y].terrain + pixels[x - 1][y].water <
      pixels[x][y].terrain + pixels[x][y].water
    )
      result.push(pixels[x - 1][y]);
    if (
      pixels[x + 1][y].terrain + pixels[x + 1][y].water <
      pixels[x][y].terrain + pixels[x][y].water
    )
      result.push(pixels[x + 1][y]);
    if (
      pixels[x][y - 1].terrain + pixels[x][y - 1].water <
      pixels[x][y].terrain + pixels[x][y].water
    )
      result.push(pixels[x][y - 1]);
    if (
      pixels[x][y + 1].terrain + pixels[x][y + 1].water <
      pixels[x][y].terrain + pixels[x][y].water
    )
      result.push(pixels[x][y + 1]);
  }
  /**
   * A linear interpolator for hexadecimal colors
   * @param {String} a
   * @param {String} b
   * @param {Number} amount
   * @example
   * // returns #7F7F7F
   * lerpColor('#000000', '#ffffff', 0.5)
   * @returns {String}
   */
  lerpColor(a, b, amount) {
    var ah = +a.replace("#", "0x"),
      ar = ah >> 16,
      ag = (ah >> 8) & 0xff,
      ab = ah & 0xff,
      bh = +b.replace("#", "0x"),
      br = bh >> 16,
      bg = (bh >> 8) & 0xff,
      bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

    return (
      "#" +
      (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
    );
  }

  changeTerrainHeight(x, y, delta) {
    if (this.checkCoord(x, y)) this.pixels[x][y].terrain += delta;
  }

  checkCoord(x, y) {
    return x <= this.width && x >= 0 && y <= this.height && y >= 0;
  }

  saveMap() {
    localStorage.setItem("heightmap", JSON.stringify(this.pixels));
    console.log(localStorage.getItem("heightmap"));
  }
}
