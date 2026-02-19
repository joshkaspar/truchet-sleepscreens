const tileSize = 40; 
const lightCol = "#ffffff";
const darkCol = "#1f1f1f";
const lineCol = "#d3d3d3";

function saveBMP(filename) {
  const ctx = drawingContext;
  const c = ctx.canvas;
  const { width: w, height: h } = c;
  const src = ctx.getImageData(0, 0, w, h).data;

  const rowBytes = Math.ceil(w * 3 / 4) * 4;
  const imgSize = rowBytes * h;
  const buf = new ArrayBuffer(54 + imgSize);
  const v = new DataView(buf);
  const d = new Uint8Array(buf);

  v.setUint16(0, 0x424D);
  v.setUint32(2, 54 + imgSize, true);
  v.setUint32(10, 54, true);
  v.setUint32(14, 40, true);
  v.setInt32(18, w, true);
  v.setInt32(22, h, true);
  v.setUint16(26, 1, true);
  v.setUint16(28, 24, true);
  v.setUint32(34, imgSize, true);

  for (let y = 0; y < h; y++) {
    const sr = (h - 1 - y) * w * 4;
    const dr = 54 + y * rowBytes;
    for (let x = 0; x < w; x++) {
      const si = sr + x * 4, di = dr + x * 3;
      d[di] = src[si + 2];
      d[di + 1] = src[si + 1];
      d[di + 2] = src[si];
    }
  }

  const url = URL.createObjectURL(new Blob([buf], { type: 'image/bmp' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = (filename || 'canvas') + '.bmp';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setup() {
  // Set canvas size to 480x800
  createCanvas(480, 800); 
  noLoop(); // We only need to draw once
  rectMode(CENTER);
}

function draw() {
  background("#d9d9d9");

  const cols = floor(width / tileSize); // Will be 12
  const rows = floor(height / tileSize); // Will be 20

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      // Calculate the center of the current tile
      const x = gx * tileSize + tileSize / 2;
      const y = gy * tileSize + tileSize / 2;
      
      const rot = floor(random(4)); // 4 possible rotations

      push(); // Save the current drawing state
      translate(x, y); // Move the origin to the center of the tile
      rotate(rot * HALF_PI); // Rotate the grid
      drawDiagonalTile(tileSize);
      pop(); // Restore the original drawing state
    }
  }
}

function drawDiagonalTile(s) {
  const h = s / 2; // Half the size

  stroke(lineCol);
  strokeWeight(1);

  // Two triangles split by a diagonal line
  fill(lightCol);
  triangle(-h, -h, h, -h, -h, h);

  fill(darkCol);
  triangle(h, h, h, -h, -h, h);

  // Optional border to emphasize tile edges
  noFill();
  stroke("#999");
  rect(0, 0, s, s);
}

function keyPressed() {
  if (key === "r" || key === "R") {
    redraw(); // regenerate the pattern
  }
  if (key === "s" || key === "S") {
    saveBMP("truchet_480x800", "png"); 
  }
}
