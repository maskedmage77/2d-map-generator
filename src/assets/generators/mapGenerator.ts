import { Application, Container, Graphics, Renderer, Sprite, Texture } from 'pixi.js';
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';
import { create, all } from 'mathjs';


interface MapGeneratorProps {
  container: Container;
  width: number;
  height: number;
  app: Application<Renderer>;
}

const OCTAVES = 4;
const LACUNARITY = 3;
const PERSISTENCE = 0.5;
const PIXEL_SIZE = 1;
const NOISE_RESOLUTION = 500;
const SEED = Math.floor(Math.random() * 1000000);
// const SEED = 1234567890; // for testing
const VERTICAL_SIZE = 720;
const HORIZONTAL_SIZE = 1080;
const FALL_OFF = 0.25;

const math = create(all);


export default async function mapGenerator({
  container,
  width,
  height,
  app
}: MapGeneratorProps) {

  console.time('Falloff Map Generation 1');  
  const falloffMap = generateFalloffMap1();
  console.timeEnd('Falloff Map Generation 1');

  console.time('Noise Generation 3');
  const noise = generateMap3({ falloffMap });
  console.timeEnd('Noise Generation 3');

  console.time('Rendering');
  render2({ noise, container });
  console.timeEnd('Rendering');

}


function calculateColor(value: number) {

  const colors = {
    snow: "#ffffff",
    mountain: "#858585",
    land: "#047000",
    beach: "#f4e1b2", 
    shallowWater: "#a0d3e8",
    deepWater: "#0a4b8c",
    deepestWater: "#04223f"
  }

  if (value > 0.8) {
    return colors.snow;
  } else if (value > 0.75) {
    return colors.mountain;
  } else if (value > 0.65) {
    return colors.land;
  } else if (value > 0.6) {
    return colors.beach;
  } else if (value > 0.5) {
    const ratio = (value - 0.5) / (0.6 - 0.5);
    return interpolateColor(colors.deepWater, colors.shallowWater, ratio);
  } else if (value > 0.35) {
    const ratio = (value - 0.35) / (0.5 - 0.35);
    return interpolateColor(colors.deepestWater, colors.deepWater, ratio);
  } else {
    return colors.deepestWater;
  }

  // the closer to 1 the more white it is
  // the closer to 0 the more black it is

  // const hexValue = Math.round(value * 255).toString(16).padStart(2, '0');
  // return `#${hexValue}${hexValue}${hexValue}`;
  
}


function render2({ noise, container } : {
  noise: number[][],
  container: Container
}) {
  const pixelData = new Uint8Array(HORIZONTAL_SIZE * VERTICAL_SIZE * 4);

  noise.forEach((row, i) => {
    row.forEach((value, j) => {
      const color = calculateColor(value);
      const index = (j * HORIZONTAL_SIZE + i) * 4;
      const rgb = parseInt(color.slice(1), 16);
      pixelData[index] = (rgb >> 16) & 255; // Red
      pixelData[index + 1] = (rgb >> 8) & 255; // Green
      pixelData[index + 2] = rgb & 255; // Blue
      pixelData[index + 3] = 255; // Alpha
    });
  });

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

  container.addChild(sprite);
  
}


function render1({ noise, container } : {
  noise: number[][],
  container: Container
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


function generateMap3({
  falloffMap
} : {
  falloffMap: number[][]
}) {

  const octaveNoise = Array.from({ length: OCTAVES }, (_, i) => 
    createNoise2D(alea(`${SEED}-${i}`))
  );

  // Precompute frequencies and amplitudes
  const frequencies = Array.from({ length: OCTAVES }, (_, octave) => Math.pow(LACUNARITY, octave));
  const amplitudes = Array.from({ length: OCTAVES }, (_, octave) => Math.pow(PERSISTENCE, octave));

  const noise = new Array(HORIZONTAL_SIZE / PIXEL_SIZE);
  const persistenceSum = amplitudes.reduce((acc, amplitude) => acc + amplitude, 0);

  for (let i = 0; i < HORIZONTAL_SIZE / PIXEL_SIZE; i++) {
    noise[i] = new Array(VERTICAL_SIZE / PIXEL_SIZE);
    for (let j = 0; j < VERTICAL_SIZE / PIXEL_SIZE; j++) {
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


function generateMap2({
  falloffMap
} : {
  falloffMap: number[][]
}) {

  const octaveNoise = Array.from({ length: OCTAVES }, (_, i) => 
    createNoise2D(alea(`${SEED}-${i}`))
  );
  
  const noise = new Array(HORIZONTAL_SIZE / PIXEL_SIZE);
  const persistenceSum = octaveNoise.reduce((acc, _, octave) => acc + Math.pow(PERSISTENCE, octave), 0);

  for (let i = 0; i < HORIZONTAL_SIZE / PIXEL_SIZE; i++) {
    noise[i] = new Array(VERTICAL_SIZE / PIXEL_SIZE);
    for (let j = 0; j < VERTICAL_SIZE / PIXEL_SIZE; j++) {
      let baseNoise = 0;

      for (let octave = 0; octave < OCTAVES; octave++) {
        const frequency = Math.pow(LACUNARITY, octave);
        const amplitude = Math.pow(PERSISTENCE, octave);
        baseNoise += ((octaveNoise[octave](
          (i / NOISE_RESOLUTION) * frequency,
          (j / NOISE_RESOLUTION) * frequency
        ) + 1) / 2) * amplitude;
      }

      baseNoise /= persistenceSum;
      noise[i][j] = falloffMap[i][j] * baseNoise;
    }
  }

  return noise as number[][];
}


function generateMap1({
  falloffMap
} : {
  falloffMap: number[][]
}){

  const octaveNoise = Array.from({ length: OCTAVES }, (_, i) => 
    createNoise2D(alea(`${SEED}-${i}`))
  );

  const noise = Array.from({ length: HORIZONTAL_SIZE / PIXEL_SIZE }, (_, i) => {
    return Array.from({ length: VERTICAL_SIZE / PIXEL_SIZE }, (_, j) => {

      const baseNoise = octaveNoise.reduce((acc, noise2D, octave) => {
        const frequency = Math.pow(LACUNARITY, octave);
        const amplitude = Math.pow(PERSISTENCE, octave);
        return acc + ((noise2D(
          (i / NOISE_RESOLUTION) * frequency,
          (j / NOISE_RESOLUTION) * frequency
        ) + 1) / 2) * amplitude;
      }, 0) / octaveNoise.reduce((acc, _, octave) => acc + Math.pow(PERSISTENCE, octave), 0);

      return falloffMap[i][j] * baseNoise;
    });
  });

  return noise as number[][];
}

// FALLOFF MAP ====================================================================================

function generateFalloffMap1() {
  const falloffMap = Array.from({ length: HORIZONTAL_SIZE / PIXEL_SIZE }, (_, i) => {
    return Array.from({ length: VERTICAL_SIZE / PIXEL_SIZE }, (_, j) => {

        const edgeDistance = Math.min(
          i / (FALL_OFF * HORIZONTAL_SIZE),
          (HORIZONTAL_SIZE - i) / (FALL_OFF * HORIZONTAL_SIZE),
          j / (FALL_OFF * VERTICAL_SIZE),
          (VERTICAL_SIZE - j) / (FALL_OFF * VERTICAL_SIZE)
        );
        return Math.max(0, Math.min(1, edgeDistance));

    });
  });
  return falloffMap;
}



function interpolateColor(deepestWater: string, deepWater: string, ratio: number) {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const color1 = hexToRgb(deepestWater);
  const color2 = hexToRgb(deepWater);

  const r = Math.round(color1.r + (color2.r - color1.r) * ratio);
  const g = Math.round(color1.g + (color2.g - color1.g) * ratio);
  const b = Math.round(color1.b + (color2.b - color1.b) * ratio);

  return rgbToHex(r, g, b);
}
