const hexSize = 50;

const TILE_DEFS = {
  A: [1],
  B: [1, 2],
  C: [1, 3],
  D: [1, 4],
  E: [1, 2, 3],
  F: [1, 2, 4],
  G: [1, 3, 5],
  H: [1, 2, 3, 4],
  I: [1, 3, 4, 5],
  J: [1, 2, 4, 5],
  K: [1, 2, 3, 4, 5],
  L: [],
  M: [1, 2, 3, 4, 5, 6],
};

const TILES = "ABCDEFGHIJKLM".split("");

function setup() {
  createCanvas(480, 800);
  noLoop();
}

function draw() {
  background(255);

  const cols = 2;
  const rows = ceil(TILES.length / cols);
  const cellW = width / cols;
  const margin = 12;
  const cellH = (height - 2 * margin) / rows;

  for (let i = 0; i < TILES.length; i++) {
    const name = TILES[i];
    const c = i % cols;
    const r = floor(i / cols);
    const cx = cellW * c + cellW / 2;
    const cy = margin + cellH * r + cellH / 2;

    push();
    translate(cx, cy);

    // Label
    fill(100);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(15);
    textStyle(BOLD);
    text(name, 0, (-hexSize * sqrt(3)) / 2 - 6);

    drawHexTile(hexSize, TILE_DEFS[name]);
    pop();
  }
}

function drawHexTile(s, activeSides) {
  const h = (s * sqrt(3)) / 2;

  // Flat-topped hex vertices (CW from right)
  const vx = [s, s / 2, -s / 2, -s, -s / 2, s / 2];
  const vy = [0, h, h, 0, -h, -h];

  //  Sides 1–6, vertex pairs [start, end]
  //  Numbered CW starting from the lower-left edge:
  //
  //        ___3___
  //       /       \
  //    2 /         \ 4
  //      \         /
  //    1  \       / 5
  //        \__6__/
  //
  const sideVerts = [
    [2, 3], // 1  lower-left
    [3, 4], // 2  upper-left
    [4, 5], // 3  top
    [5, 0], // 4  upper-right
    [0, 1], // 5  lower-right
    [1, 2], // 6  bottom
  ];

  // Filled inward squares
  fill(0);
  noStroke();
  for (const sn of activeSides) {
    const [a, b] = sideVerts[sn - 1];
    const dx = vx[b] - vx[a];
    const dy = vy[b] - vy[a];
    // Inward perpendicular, same length as side
    const nx = -dy;
    const ny = dx;

    beginShape();
    vertex(vx[a], vy[a]);
    vertex(vx[b], vy[b]);
    vertex(vx[b] + nx, vy[b] + ny);
    vertex(vx[a] + nx, vy[a] + ny);
    endShape(CLOSE);
  }

  // Hex outline on top
  noFill();
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < 6; i++) vertex(vx[i], vy[i]);
  endShape(CLOSE);
}

function keyPressed() {
  if (key === "r" || key === "R") redraw();
  if (key === "s" || key === "S") saveCanvas("hex_tiles", "png");
}
