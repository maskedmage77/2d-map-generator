import { MapStyle } from "../types/MapStyle";

export default function calculateColor(value: number, style: MapStyle = "default") {

  const colorSchemes = {
    default: {
      snow: "#ffffff",
      mountain: "#858585",
      land: "#047000",
      beach: "#f4e1b2",
      shallowWater: "#a0d3e8",
      deepWater: "#0a4b8c",
      deepestWater: "#04223f",
    },
    paper: {
      snow: "#f8f8f2",
      mountain: "#a9a18c",
      land: "#c2b280",
      beach: "#e9d8a6",
      shallowWater: "#a3c4bc",
      deepWater: "#5b7f95",
      deepestWater: "#2c3e50",
    },
    pastel: {
      snow: "#ffebee",
      mountain: "#bcaaa4",
      land: "#a5d6a7",
      beach: "#ffe0b2",
      shallowWater: "#b3e5fc",
      deepWater: "#81d4fa",
      deepestWater: "#4ba3c7",
    },
    "black and white": null, // Special case handled separately
  };

  const selectedColors = colorSchemes[style] || colorSchemes.default;

  if (style === "black and white") {
    const hexValue = Math.round(value * 255).toString(16).padStart(2, "0");
    return `#${hexValue}${hexValue}${hexValue}`;
  }

  if (!selectedColors) {
    return colorSchemes.default.land;
  }

  if (value > 0.8) {
    return selectedColors.snow;
  } else if (value > 0.75) {
    return selectedColors.mountain;
  } else if (value > 0.65) {
    return selectedColors.land;
  } else if (value > 0.6) {
    return selectedColors.beach;
  } else if (value > 0.5) {
    const ratio = (value - 0.5) / (0.6 - 0.5);
    return interpolateColor(selectedColors.deepWater, selectedColors.shallowWater, ratio);
  } else if (value > 0.35) {
    const ratio = (value - 0.35) / (0.5 - 0.35);
    return interpolateColor(selectedColors.deepestWater, selectedColors.deepWater, ratio);
  } else {
    return selectedColors.deepestWater;
  }
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
