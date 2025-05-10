import { createNoise2D } from "simplex-noise";
import alea from "alea";

export default function generateMap({
  falloffMap,
  HORIZONTAL_SIZE = 512,
  VERTICAL_SIZE = 512,
  NOISE_RESOLUTION = 500,
  SEED = Math.floor(Math.random() * 1000000),
  OCTAVES = 4,
  LACUNARITY = 3,
  PERSISTENCE = 0.5
} : {
  falloffMap: number[][]
  HORIZONTAL_SIZE?: number;
  VERTICAL_SIZE?: number;
  NOISE_RESOLUTION?: number;
  SEED?: number;
  OCTAVES?: number;
  LACUNARITY?: number;
  PERSISTENCE?: number;
}) {

  const octaveNoise = Array.from({ length: OCTAVES }, (_, i) => 
    createNoise2D(alea(`${SEED}-${i}`))
  );

  // Precompute frequencies and amplitudes
  const frequencies = Array.from({ length: OCTAVES }, (_, octave) => Math.pow(LACUNARITY, octave));
  const amplitudes = Array.from({ length: OCTAVES }, (_, octave) => Math.pow(PERSISTENCE, octave));

  const noise = new Array(HORIZONTAL_SIZE);
  const persistenceSum = amplitudes.reduce((acc, amplitude) => acc + amplitude, 0);

  for (let i = 0; i < HORIZONTAL_SIZE; i++) {
    noise[i] = new Array(VERTICAL_SIZE);
    for (let j = 0; j < VERTICAL_SIZE; j++) {
      let baseNoise = 0;

      for (let octave = 0; octave < OCTAVES; octave++) {
        baseNoise += ((octaveNoise[octave](
          (i / NOISE_RESOLUTION) * frequencies[octave],
          (j / NOISE_RESOLUTION) * frequencies[octave]
        ) + 1) / 2) * amplitudes[octave];
      }

      baseNoise /= persistenceSum;
      noise[i][j] = falloffMap[i][j] * baseNoise;
    }
  }

  return noise as number[][];
}