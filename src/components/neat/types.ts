export interface NEATColor {
  color: string;
  enabled: boolean;
}

export interface NEATConfig {
  colors: NEATColor[];
  speed: number;
  horizontalPressure: number;
  verticalPressure: number;
  waveFrequencyX: number;
  waveFrequencyY: number;
  waveAmplitude: number;
  shadows: number;
  highlights: number;
  colorBrightness: number;
  colorSaturation: number;
  wireframe: boolean;
  colorBlending: number;
  backgroundColor: string;
  backgroundAlpha: number;
  grainScale: number;
  grainSparsity: number;
  grainIntensity: number;
  grainSpeed: number;
  resolution: number;
}

export const DEFAULT_NEAT_CONFIG: NEATConfig = {
  colors: [
    { color: '#D3F6FA', enabled: true },
    { color: '#E7FBEE', enabled: true },
    { color: '#FFFCEB', enabled: true },
    { color: '#FEE6E0', enabled: true },
    { color: '#a2d2ff', enabled: false },
  ],
  speed: 4,
  horizontalPressure: 4,
  verticalPressure: 6,
  waveFrequencyX: 2,
  waveFrequencyY: 4,
  waveAmplitude: 3,
  shadows: 0,
  highlights: 4,
  colorBrightness: 1,
  colorSaturation: 3,
  wireframe: false,
  colorBlending: 5,
  backgroundColor: '#003FFF',
  backgroundAlpha: 1,
  grainScale: 0,
  grainSparsity: 0,
  grainIntensity: 0.05,
  grainSpeed: 0,
  resolution: 1.2,
};