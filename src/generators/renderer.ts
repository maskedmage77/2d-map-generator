import { Container, Sprite, Texture } from "pixi.js";
import calculateColor from "./calculateColor";

export default function renderer({
  noise,
  container,
  HORIZONTAL_SIZE = 1080,
  VERTICAL_SIZE = 720,
  DETAIL_LEVEL = 1,
} : {
  noise: number[][],
  container: Container,
  HORIZONTAL_SIZE?: number,
  VERTICAL_SIZE?: number,
  DETAIL_LEVEL?: number,
}) {
  const pixelData = new Uint8Array(HORIZONTAL_SIZE * VERTICAL_SIZE * 4);

  console.time("color-calculation");
  const len = noise.length;  // Cache the length to avoid recalculating
  for (let i = 0; i < len; i++) {
    const row = noise[i];
    const rowLen = row.length;  // Cache the row length
    const rowOffset = i * rowLen * 4;  // Offset for the row in pixelData
  
    for (let j = 0; j < rowLen; j++) {
      const value = row[j];
      const color = calculateColor(value);
      const index = (j * 4) + rowOffset;
      const rgb = parseInt(color.slice(1), 16);
  
      pixelData[index] = (rgb >> 16) & 255; // Red
      pixelData[index + 1] = (rgb >> 8) & 255; // Green
      pixelData[index + 2] = rgb & 255; // Blue
      pixelData[index + 3] = 255; // Alpha
    }
  }
  console.timeEnd("color-calculation");

  const imageData = new ImageData(new Uint8ClampedArray(pixelData), HORIZONTAL_SIZE, VERTICAL_SIZE);
  const canvas = document.createElement('canvas');
  canvas.width = HORIZONTAL_SIZE;
  canvas.height = VERTICAL_SIZE;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }
  const texture = Texture.from(canvas);
  const sprite = new Sprite(texture);
  
  container.scale.set(
    1 / DETAIL_LEVEL,
    1 / DETAIL_LEVEL
  );

  container.addChild(sprite);
}