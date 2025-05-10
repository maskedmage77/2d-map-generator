import mapWorker from './mapWorker?worker';
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
    octaves
   } = mapStore.getState();

  const worker = new mapWorker();

  console.log('Starting map generation...');
  worker.postMessage({
    width,
    height,
    detailLevel,
    octaves
  });

  worker.onmessage = function (event) {
    const { noise, HORIZONTAL_SIZE, VERTICAL_SIZE, DETAIL_LEVEL } = event.data;

    console.log('Map generation completed. Starting rendering...');
    console.time('Rendering');
    renderer({
      noise,
      container,
      HORIZONTAL_SIZE,
      VERTICAL_SIZE,
      DETAIL_LEVEL
    });
    console.timeEnd('Rendering');
    console.log('Rendering completed.');
  };
}
