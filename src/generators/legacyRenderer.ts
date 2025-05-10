import { Container, Graphics } from "pixi.js";
import calculateColor from "./calculateColor";

export default function legacyRenderer({ noise, container } : {
  noise: number[][],
  container: Container,
}) {
  const obj = new Graphics();

  noise.forEach((row, i) => {
    row.forEach((value, j) => {
      obj.rect(
        i, j, 1,1
      ).fill(calculateColor(value));
    });
  }); 
  
  container.addChild(obj);
}
