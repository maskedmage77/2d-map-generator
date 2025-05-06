export default function calculateColor(value: number) {

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

  // const hexValue = Math.round(value * 255).toString(16).padStart(2, '0');
  // return `#${hexValue}${hexValue}${hexValue}`;
  
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
