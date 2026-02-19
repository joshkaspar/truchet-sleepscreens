// Pure black and white for e-ink displays
const bgColor = "#ffffff";
const fgColor = "#000000";

const tileSize = 40;

function setup() {
  createCanvas(480, 800);
  noLoop(); // We only need to draw once
}

function draw() {
  background(bgColor);

  const cols = width / tileSize;
  const rows = height / tileSize;

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x = gx * tileSize;
      const y = gy * tileSize;

      push();
      translate(x, y); // Move origin to the tile's top-left corner
      draw10PrintPolygon(tileSize);
      pop();
    }
  }
}

/**
 * Draws the '10 PRINT' pattern using a filled hexagon
 * to create a 'fat' slash with pointed ends that meet the tile edges.
 */
function draw10PrintPolygon(s) {
  // The 'fatness' of the slash. This value is the inset from the corner.
  // A larger value makes a thinner slash. A good value is between 25-40% of tile size.
  const fatness = s * 0.35;

  noStroke();
  fill(fgColor);

  // Randomly choose one of the two slash orientations
  if (random(1) > 0.5) {
    // Draw a forward-slash: /
    // This is a hexagon defined by six vertices.
    beginShape();
    vertex(s - fatness, 0); // Top edge, left point
    vertex(s, 0); // Top-right corner
    vertex(s, fatness); // Right edge, top point
    vertex(fatness, s); // Bottom edge, right point
    vertex(0, s); // Bottom-left corner
    vertex(0, s - fatness); // Left edge, bottom point
    endShape(CLOSE);
  } else {
    // Draw a back-slash: \
    // This is the other hexagon.
    beginShape();
    vertex(0, fatness); // Left edge, top point
    vertex(0, 0); // Top-left corner
    vertex(fatness, 0); // Top edge, right point
    vertex(s, s - fatness); // Right edge, bottom point
    vertex(s, s); // Bottom-right corner
    vertex(s - fatness, s); // Bottom edge, left point
    endShape(CLOSE);
  }
}

function keyPressed() {
  if (key === "r" || key === "R" || keyCode === 32) {
    // Allow spacebar too
    redraw(); // Regenerate the maze
  }
  if (key === "s" || key === "S") {
    saveCanvas("10print_e-ink", "png");
  }
}
