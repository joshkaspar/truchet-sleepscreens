// adapted from '10 print - original' by StevesMakerspace

const bgColor = "#ffffff";
const fgColor = "#000000";

const tileSize = 30;
const weight = 4;

function setup() {
  createCanvas(480, 800);
  noLoop();
}

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

  view.setUint16(0, 0x424d, true);
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

function draw() {
  background(bgColor);
  stroke(fgColor);
  strokeWeight(weight);
  strokeCap(ROUND);

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      // Random, not noise driven
      const c = random(2);

      if (c < 1) {
        line(x, y, x + tileSize, y + tileSize); // ＼
      } else {
        line(x, y + tileSize, x + tileSize, y); // ／
      }
    }
  }
}

function keyPressed() {
  if (key === "r" || key === "R" || keyCode === 32) redraw();
  if (key === "s" || key === "S") saveBMP("10print_lines");
}
