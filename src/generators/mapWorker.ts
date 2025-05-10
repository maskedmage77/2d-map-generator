import generateFalloffMap from './generateFalloffMap';
import generateMap from './generateMap';

self.onmessage = async function (event) {
  const { width, height, detailLevel, octaves } = event.data;

  const DETAIL_LEVEL = detailLevel;
  const OCTAVES = octaves;
  const LACUNARITY = 3;
  const PERSISTENCE = 0.5;
  const NOISE_RESOLUTION = 500 * DETAIL_LEVEL;
  const SEED = Math.floor(Math.random() * 1000000);
  const VERTICAL_SIZE = height * DETAIL_LEVEL;
  const HORIZONTAL_SIZE = width * DETAIL_LEVEL;
  const FALL_OFF = 0.25;

  console.time('Falloff Map Generation');
  const falloffMap = generateFalloffMap({
    HORIZONTAL_SIZE,
    VERTICAL_SIZE,
    FALL_OFF
  });
  console.timeEnd('Falloff Map Generation');

  console.time('Noise Generation');
  const noise = generateMap({
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

  self.postMessage({ noise, HORIZONTAL_SIZE, VERTICAL_SIZE, DETAIL_LEVEL });
};