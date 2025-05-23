import { Container, Sprite, Texture } from "pixi.js";
import calculateColor from "./calculateColor";
import { MapStyle } from "../types/MapStyle";

export default function renderer({
  noise,
  container,
  HORIZONTAL_SIZE = 1080,
  VERTICAL_SIZE = 720,
  DETAIL_LEVEL = 1,
  STYLE = "default",
} : {
  noise: number[][],
  container: Container,
  HORIZONTAL_SIZE?: number,
  VERTICAL_SIZE?: number,
  DETAIL_LEVEL?: number,
  STYLE?: MapStyle,
}) {
  const pixelData = new Uint8Array(HORIZONTAL_SIZE * VERTICAL_SIZE * 4);

  console.time("color-calculation");
  for (let i = 0; i < noise.length; i++) {
    const row = noise[i];
    for (let j = 0; j < row.length; j++) {
      const value = row[j];
      const color = calculateColor(value, STYLE);
      const index = (j * HORIZONTAL_SIZE + i) * 4;
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

  // canvas.toBlob((blob) => {
  //   if (blob) {
  //     const a = document.createElement('a');
  //     a.href = URL.createObjectURL(blob);
  //     a.download = 'map.png';
  //     a.click();
  //     URL.revokeObjectURL(a.href);
  //   }
  // }, 'image/png');
  
  container.scale.set(
    1 / DETAIL_LEVEL,
    1 / DETAIL_LEVEL
  );

  container.addChild(sprite);
}