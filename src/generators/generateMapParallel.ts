import NoiseGenerationWorker from './noiseGenerationWorker?worker';

export default async function generateMapParallel({
  falloffMap,
  HORIZONTAL_SIZE = 512,
  VERTICAL_SIZE = 512,
  NOISE_RESOLUTION = 500,
  SEED = Math.floor(Math.random() * 1000000),
  OCTAVES = 4,
  LACUNARITY = 3,
  PERSISTENCE = 0.5
}: {
  falloffMap: number[][];
  HORIZONTAL_SIZE?: number;
  VERTICAL_SIZE?: number;
  NOISE_RESOLUTION?: number;
  SEED?: number | string;
  OCTAVES?: number;
  LACUNARITY?: number;
  PERSISTENCE?: number;
}) {
  const WORKER_COUNT = navigator.hardwareConcurrency || 4;
  const chunkSize = Math.floor(HORIZONTAL_SIZE / WORKER_COUNT);

  const workers = Array.from({ length: WORKER_COUNT }, (_, index) => {
    const startRow = index * chunkSize;
    const endRow = index === WORKER_COUNT - 1 ? HORIZONTAL_SIZE : startRow + chunkSize;

    const worker = new NoiseGenerationWorker();
    const falloffMapChunk = falloffMap.slice(startRow, endRow);

    return new Promise<number[][]>((resolve) => {
      worker.onmessage = (e) => {
        worker.terminate();
        resolve(e.data.result);
      };

      worker.postMessage({
        startRow,
        endRow,
        HORIZONTAL_SIZE,
        VERTICAL_SIZE,
        NOISE_RESOLUTION,
        SEED,
        OCTAVES,
        LACUNARITY,
        PERSISTENCE,
        falloffMapChunk,
      });
    });
  });

  const results = await Promise.all(workers);
  const finalMap = results.flat();
  return finalMap;
}
