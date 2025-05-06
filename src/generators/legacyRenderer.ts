import { Container, Graphics } from "pixi.js";
import calculateColor from "./calculateColor";

export default function legacyRenderer({ noise, container, PIXEL_SIZE } : {
  noise: number[][],
  container: Container,
  PIXEL_SIZE: number
}) {
  const obj = new Graphics();

  noise.forEach((row, i) => {
    row.forEach((value, j) => {
      obj.rect(
        i * PIXEL_SIZE,
        j * PIXEL_SIZE,
        PIXEL_SIZE,
        PIXEL_SIZE
      ).fill(calculateColor(value));
    });
  }); 
  
  container.addChild(obj);
}
