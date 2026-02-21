const bgCol = "#ffffff";
const fgCol = "#000000";
const minEdgeDist = 100;
const minPointDist = 350;

let ringSpacing;

let s1, s2, maxRadius;

function saveBMP(filename = "canvas") {
  const c =
    (typeof _renderer !== "undefined" && _renderer.canvas) ||
    (typeof drawingContext !== "undefined" && drawingContext.canvas);

  if (!c) {
    console.error("No p5 canvas found.");
    return;
  }

  const ctx = c.getContext("2d");
  const w = c.width;
  const h = c.height;
  const src = ctx.getImageData(0, 0, w, h).data;

  const rowBytes = Math.ceil((w * 3) / 4) * 4;
  const imgSize = rowBytes * h;
  const fileSize = 54 + imgSize;

  const buf = new ArrayBuffer(fileSize);
  const view = new DataView(buf);
  const out = new Uint8Array(buf);

  view.setUint16(0, 0x424d);
  view.setUint32(2, fileSize, true);
  view.setUint32(6, 0, true);
  view.setUint32(10, 54, true);

  view.setUint32(14, 40, true);
  view.setInt32(18, w, true);
  view.setInt32(22, h, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, imgSize, true);
  view.setInt32(38, 0, true);
  view.setInt32(42, 0, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  for (let y = 0; y < h; y++) {
    const srcRow = (h - 1 - y) * w * 4;
    const dstRow = 54 + y * rowBytes;
    for (let x = 0; x < w; x++) {
      const si = srcRow + x * 4;
      const di = dstRow + x * 3;
      out[di] = src[si + 2];
      out[di + 1] = src[si + 1];
      out[di + 2] = src[si];
    }
  }

  const blob = new Blob([buf], { type: "image/bmp" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".bmp") ? filename : `${filename}.bmp`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setup() {
  createCanvas(480, 800);
  pixelDensity(1);
  noLoop();

  generatePoints();

  const btnStyle = `
    display: inline-block;
    margin: 8px 4px 0;
    padding: 12px 28px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: #1f1f1f;
    color: #fff;
    touch-action: manipulation;
  `;

  const redrawBtn = createButton("Redraw");
  redrawBtn.attribute("style", btnStyle);
  redrawBtn.mousePressed(() => {
    generatePoints();
    redraw();
  });

  const saveBtn = createButton("Save BMP");
  saveBtn.attribute("style", btnStyle);
  saveBtn.mousePressed(() => saveBMP("ripple"));
}

function generatePoints() {
  ringSpacing = floor(random(4, 13));

  let attempts = 0;
  do {
    s1 = createVector(
      random(minEdgeDist, width - minEdgeDist),
      random(minEdgeDist, height - minEdgeDist)
    );
    s2 = createVector(
      random(minEdgeDist, width - minEdgeDist),
      random(minEdgeDist, height - minEdgeDist)
    );
    attempts++;
  } while (dist(s1.x, s1.y, s2.x, s2.y) < minPointDist && attempts < 500);

  const d = dist(s1.x, s1.y, s2.x, s2.y);
  // Snap to ring boundary so the ripple edge lands cleanly on a ring
  maxRadius = round((d * 0.75) / ringSpacing) * ringSpacing;
}

function draw() {
  const maxR2 = maxRadius * maxRadius;

  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx1 = x - s1.x,
        dy1 = y - s1.y;
      const dx2 = x - s2.x,
        dy2 = y - s2.y;
      const d1sq = dx1 * dx1 + dy1 * dy1;
      const d2sq = dx2 * dx2 + dy2 * dy2;
      const inR1 = d1sq <= maxR2;
      const inR2 = d2sq <= maxR2;

      let col;
      if (!inR1 && !inR2) {
        col = 255;
      } else {
        const w1 = inR1 ? sin((sqrt(d1sq) / ringSpacing) * PI) : 0;
        const w2 = inR2 ? sin((sqrt(d2sq) / ringSpacing) * PI) : 0;
        col = w1 + w2 > 0 ? 0 : 255;
      }

      const idx = (y * width + x) * 4;
      pixels[idx] = col;
      pixels[idx + 1] = col;
      pixels[idx + 2] = col;
      pixels[idx + 3] = 255;
    }
  }
  updatePixels();
}
