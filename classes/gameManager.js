import {Heightmap} from "./heightMap.js";
import {Brush} from "./brush.js";

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

        if(!navigator.getGamepads) {
            console.log("Gamepads are unsupported!");
        } else {
            console.log(navigator.getGamepads());
            window.addEventListener("gamepadconnected", (e) => {
                console.log(e);
                console.log(navigator.getGamepads());
            });
        }

        this.lastTimeStamp = Date.now();

        this.update();
    }

    update() {
        const deltaTime = (Date.now() - this.lastTimeStamp) / 1000;
        this.lastTimeStamp = Date.now();

        this.clear()

        // plateforms
        for(let plateform of this.platforms) {
            plateform.draw(this.ctx);
        }
        this.drawTool.currentRectangle.draw(this.ctx);

        // player
        this.player.handleGamepad();
        this.player.updatePosition(deltaTime);

        const collisions = this.player.solveCollisions(this.player.getDeltaPosition(deltaTime), this.platforms);
        if(collisions.blockedTowardsLeft || collisions.blockedTowardsRight) this.player.velocity.x = 0;
        if(collisions.blockedTowardsTop || collisions.blockedTowardsBottom) this.player.velocity.y = 0;
        this.player.grounded = collisions.blockedTowardsBottom;

        if(!this.player.isInBounds(this.canvas.width, this.canvas.height)) {
            this.respawnPlayer();
        }

        this.player.draw(this.ctx);

        requestAnimationFrame(() => this.update());
    }

    resizeCanvas() {
        const size = this.rect;
        this.canvas.width = sizet.width;
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