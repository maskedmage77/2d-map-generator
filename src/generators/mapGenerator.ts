import generateMapParallel from './generateMapParallel';
import generateFalloffMap from './generateFalloffMap';
import mapStore from '../stores/mapStore';
import { Container } from 'pixi.js';
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

  const {
    detailLevel,
    octaves,
    seed,
    style
   } = mapStore.getState();

  const DETAIL_LEVEL = detailLevel;
  const OCTAVES = octaves;
  const LACUNARITY = 3;
  const PERSISTENCE = 0.5;
  const NOISE_RESOLUTION = 500 * DETAIL_LEVEL;
  const SEED = seed;
  const VERTICAL_SIZE = height * DETAIL_LEVEL;
  const HORIZONTAL_SIZE = width * DETAIL_LEVEL;
  const FALL_OFF = 0.25;
  const STYLE = style;

  console.time('Falloff Map Generation');
  const falloffMap = generateFalloffMap({
    HORIZONTAL_SIZE,
    VERTICAL_SIZE,
    FALL_OFF
  });
  console.timeEnd('Falloff Map Generation');

  console.time('Noise Generation');
  const noise = await generateMapParallel({
    falloffMap,
    HORIZONTAL_SIZE,
    VERTICAL_SIZE,
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
    VERTICAL_SIZE,
    DETAIL_LEVEL,
    STYLE
  });
  console.timeEnd('Rendering');
  console.log('Rendering completed.');
}
