const tileSize = 40;

// Tiles that share edge signatures can't be adjacent,
// tiles from opposite groups always match
const GROUP_1 = ["A", "D"]; // black/white bg, arcs at TR+BL / TL+BR
const GROUP_2 = ["B", "C"]; // the complementary pair

function setup() {
  createCanvas(480, 800);
  noLoop();
}

function draw() {
  background(255);

  const cols = floor(width / tileSize);
  const rows = floor(height / tileSize);

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x = gx * tileSize + tileSize / 2;
      const y = gy * tileSize + tileSize / 2;

      // Checkerboard guarantees every neighbor is from the other group
      const group = (gx + gy) % 2 === 0 ? GROUP_1 : GROUP_2;
      const type = random(group);

      push();
      translate(x, y);
      drawTile(tileSize, type);
      pop();
    }
  }
}

function drawTile(s, type) {
  const h = s / 2;

  //  A = white bg, black arcs at TR + BL
  //  B = white bg, black arcs at TL + BR
  //  C = black bg, white arcs at TR + BL  (inverted A)
  //  D = black bg, white arcs at TL + BR  (inverted B)
  let bg, fg, dir;
  switch (type) {
    case "A":
      bg = 255;
      fg = 0;
      dir = 1;
      break;
    case "B":
      bg = 255;
      fg = 0;
      dir = 2;
      break;
    case "C":
      bg = 0;
      fg = 255;
      dir = 1;
      break;
    case "D":
      bg = 0;
      fg = 255;
      dir = 2;
      break;
  }

  noStroke();

  // Tile background
  fill(bg);
  rectMode(CENTER);
  rect(0, 0, s, s);

  // Filled quarter-circle arcs at two diagonal corners
  fill(fg);
  if (dir === 1) {
    // Top-right corner + bottom-left corner
    arc(h, -h, s, s, HALF_PI, PI, PIE);
    arc(-h, h, s, s, -HALF_PI, 0, PIE);
  } else {
    // Top-left corner + bottom-right corner
    arc(-h, -h, s, s, 0, HALF_PI, PIE);
    arc(h, h, s, s, PI, PI + HALF_PI, PIE);
  }
}

function keyPressed() {
  if (key === "r" || key === "R") redraw();
  if (key === "s" || key === "S") saveCanvas("smith_tiles", "png");
}
