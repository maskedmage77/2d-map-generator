import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

self.onmessage = function (e) {
  const {
    startRow, endRow,
    VERTICAL_SIZE,
    NOISE_RESOLUTION, SEED,
    OCTAVES, LACUNARITY, PERSISTENCE,
    falloffMapChunk
  } = e.data;
  const frequencies = Array.from({ length: OCTAVES }, (_, i) => Math.pow(LACUNARITY, i));
  const amplitudes = Array.from({ length: OCTAVES }, (_, i) => Math.pow(PERSISTENCE, i));
  const persistenceSum = amplitudes.reduce((sum, a) => sum + a, 0);
  const octaveNoise = Array.from({ length: OCTAVES }, (_, i) => createNoise2D(alea(`${SEED}-${i}`)));

  const result: number[][] = [];

  for (let i = startRow; i < endRow; i++) {
    const row: number[] = [];
    for (let j = 0; j < VERTICAL_SIZE; j++) {
      let baseNoise = 0;

      for (let octave = 0; octave < OCTAVES; octave++) {
        const x = (i / NOISE_RESOLUTION) * frequencies[octave];
        const y = (j / NOISE_RESOLUTION) * frequencies[octave];
        baseNoise += ((octaveNoise[octave](x, y) + 1) / 2) * amplitudes[octave];
      }

      baseNoise /= persistenceSum;
      row.push(falloffMapChunk[i - startRow][j] * baseNoise);
    }
    result.push(row);
  }

  self.postMessage({ startRow, result });
};
