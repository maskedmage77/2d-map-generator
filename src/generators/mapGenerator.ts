import { Application, Container, Renderer } from 'pixi.js';
import generateFalloffMap from './generateFalloffMap';
import generateMap from './generateMap';
import renderer from './renderer';

interface MapGeneratorProps {
  container: Container;
  width: number;
  height: number;
}

export default async function mapGenerator({
  container,
  width,
  height,
}: MapGeneratorProps) {

  const OCTAVES = 4;
  const LACUNARITY = 3;
  const PERSISTENCE = 0.5;
  const PIXEL_SIZE = 1;
  const NOISE_RESOLUTION = 500;
  const SEED = Math.floor(Math.random() * 1000000);
  // const SEED = 1234567890; // for testing
  const VERTICAL_SIZE = height;
  const HORIZONTAL_SIZE = width;
  const FALL_OFF = 0.25;

  console.time('Falloff Map Generation');  
  const falloffMap = generateFalloffMap({
    HORIZONTAL_SIZE,
    VERTICAL_SIZE,
    PIXEL_SIZE,
    FALL_OFF
  });
  console.timeEnd('Falloff Map Generation');

  console.time('Noise Generation');
  const noise = generateMap({
    falloffMap,
    HORIZONTAL_SIZE,
    VERTICAL_SIZE,
    PIXEL_SIZE,
    NOISE_RESOLUTION,
    SEED,
    OCTAVES,
    LACUNARITY,
    PERSISTENCE
  });
  console.timeEnd('Noise Generation');

  console.time('Rendering');
  renderer({
    noise,
    container,
    HORIZONTAL_SIZE,
    VERTICAL_SIZE
  });
  console.timeEnd('Rendering');

}
