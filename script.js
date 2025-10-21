

// ======== Canvas Setup ========
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// ======== Game Variables ========
let frames = 0;
const DEGREE = Math.PI / 180;

const birdImg = new Image();
birdImg.src = "bird.png"; // Make sure the image path is correct

const bgImg = new Image();
bgImg.src = "background.png";

const fgImg = new Image();
fgImg.src = "foreground.png";

const pipeNorth = new Image();
pipeNorth.src = "pipeNorth.png";
const pipeSouth = new Image();
pipeSouth.src = "pipeSouth.png";

// ======== Bird Physics ========
const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  gravity: 0.25,
  lift: -6.5, // Higher negative = higher jump (upscale)
  velocity: 0,
  rotation: 0,
  jump() {
    this.velocity = this.lift;
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Tilt bird slightly depending on movement
    if (this.velocity < 0) {
      this.rotation = -25 * DEGREE;
    } else {
      this.rotation = 25 * DEGREE;
    }

    // Prevent bird from falling below ground
    if (this.y + this.h >= canvas.height - 80) {
      this.y = canvas.height - 80 - this.h;
      this.velocity = 0;
    }

    // Prevent bird from going off the top
    if (this.y <= 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(birdImg, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  },
};

// ======== Pipes ========
const pipes = [];
pipes.push({
  x: canvas.width,
  y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
});

const pipeGap = 110;
const pipeSpeed = 2.5;

// ======== Score ========
let score = 0;
const scoreSound = new Audio("score.mp3");

// ======== Game Controls ========
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bird.jump();
  }
});
canvas.addEventListener("click", () => bird.jump());

// ======== Draw Function ========
function draw() {
  ctx.drawImage(bgImg, 0, 0);

  for (let i = 0; i < pipes.length; i++) {
    const p = pipes[i];
    const constant = pipeNorth.height + pipeGap;

    ctx.drawImage(pipeNorth, p.x, p.y);
    ctx.drawImage(pipeSouth, p.x, p.y + constant);

    p.x -= pipeSpeed;

    // Generate new pipes
    if (p.x === 150) {
      pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
      });
    }

    // Collision detection
    if (
      bird.x + bird.w >= p.x &&
      bird.x <= p.x + pipeNorth.width &&
      (bird.y <= p.y + pipeNorth.height ||
        bird.y + bird.h >= p.y + constant)
    ) {
      location.reload(); // restart game
    }

    // Remove old pipes
    if (p.x + pipeNorth.width < 0) {
      pipes.shift();
      score++;
      scoreSound.play();
    }
  }

  ctx.drawImage(fgImg, 0, canvas.height - fgImg.height);
  bird.draw();

  // Score text
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// ======== Update Loop ========
function update() {
  bird.update();
}

// ======== Animation Loop ========
function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();
