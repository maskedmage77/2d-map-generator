import { Container, Sprite, Texture } from "pixi.js";
import calculateColor from "./calculateColor";

export default function renderer({
  noise,
  container,
  HORIZONTAL_SIZE = 1080,
  VERTICAL_SIZE = 720
} : {
  noise: number[][],
  container: Container,
  HORIZONTAL_SIZE?: number,
  VERTICAL_SIZE?: number
}) {
  const pixelData = new Uint8Array(HORIZONTAL_SIZE * VERTICAL_SIZE * 4);

  noise.forEach((row, i) => {
    row.forEach((value, j) => {
      const color = calculateColor(value);
      const index = (j * HORIZONTAL_SIZE + i) * 4;
      const rgb = parseInt(color.slice(1), 16);
      pixelData[index] = (rgb >> 16) & 255; // Red
      pixelData[index + 1] = (rgb >> 8) & 255; // Green
      pixelData[index + 2] = rgb & 255; // Blue
      pixelData[index + 3] = 255; // Alpha
    });
  });

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

  container.addChild(sprite);
  
}