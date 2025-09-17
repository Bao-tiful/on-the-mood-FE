import { NEATConfig, NEATColor } from './types';

export class ColorBlender {
  private config: NEATConfig;

  constructor(config: NEATConfig) {
    this.config = config;
  }

  updateConfig(config: NEATConfig) {
    this.config = config;
  }

  /**
   * 활성화된 색상들만 필터링
   */
  getActiveColors(): NEATColor[] {
    return this.config.colors.filter(color => color.enabled);
  }

  /**
   * 색상 밝기 조정
   */
  adjustBrightness(color: string, factor: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const adjustedR = Math.max(0, Math.min(255, Math.round(rgb.r * factor)));
    const adjustedG = Math.max(0, Math.min(255, Math.round(rgb.g * factor)));
    const adjustedB = Math.max(0, Math.min(255, Math.round(rgb.b * factor)));

    return this.rgbToHex(adjustedR, adjustedG, adjustedB);
  }

  /**
   * 색상 채도 조정
   */
  adjustSaturation(color: string, factor: number): string {
    const hsl = this.hexToHsl(color);
    if (!hsl) return color;

    const adjustedSaturation = Math.max(0, Math.min(1, hsl.s * (factor / 3)));
    return this.hslToHex(hsl.h, adjustedSaturation, hsl.l);
  }

  /**
   * 하이라이트 효과 적용
   */
  applyHighlights(color: string, intensity: number): string {
    if (this.config.highlights === 0) {
      return color; // 하이라이트가 0이면 원본 색상 그대로 반환
    }
    const highlightFactor = 1 + (this.config.highlights * intensity * 0.1);
    return this.adjustBrightness(color, highlightFactor);
  }

  /**
   * 그라데이션 스탑 생성
   */
  generateGradientStops(positions: number[], time: number): Array<{
    offset: string;
    stopColor: string;
    stopOpacity: number;
  }> {
    const activeColors = this.getActiveColors();
    const stops: Array<{
      offset: string;
      stopColor: string;
      stopOpacity: number;
    }> = [];

    activeColors.forEach((colorObj, index) => {
      if (index < positions.length) {
        let color = colorObj.color;
        
        // colorBrightness가 1이 아닐 때만 밝기 조정
        if (this.config.colorBrightness !== 1) {
          color = this.adjustBrightness(color, this.config.colorBrightness);
        }
        
        // colorSaturation이 1이 아닐 때만 채도 조정
        if (this.config.colorSaturation !== 1) {
          color = this.adjustSaturation(color, this.config.colorSaturation);
        }
        
        // 하이라이트 효과 (highlights가 0이면 적용 안됨)
        if (this.config.highlights > 0) {
          const waveIntensity = (Math.sin(time * 0.001 + index) + 1) * 0.5;
          color = this.applyHighlights(color, waveIntensity);
        }

        stops.push({
          offset: `${Math.round(positions[index] * 100)}%`,
          stopColor: color,
          stopOpacity: 1
        });
      }
    });

    return stops;
  }

  /**
   * 애니메이션된 그라데이션 색상 배열 생성
   */
  generateAnimatedColors(time: number): string[] {
    const activeColors = this.getActiveColors();
    return activeColors.map((colorObj, index) => {
      let color = colorObj.color;
      
      // 시간 기반 색상 변화
      const timeOffset = time * this.config.speed * 0.001 + index * Math.PI * 0.5;
      const brightnessFactor = this.config.colorBrightness + 
        Math.sin(timeOffset) * 0.2 * (this.config.highlights / 10);
      
      color = this.adjustBrightness(color, brightnessFactor);
      color = this.adjustSaturation(color, this.config.colorSaturation);
      
      return color;
    });
  }

  /**
   * 블렌딩 모드에 따른 색상 조합
   */
  blendColors(color1: string, color2: string, ratio: number): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;

    const blendStrength = this.config.colorBlending / 10;
    const effectiveRatio = ratio * blendStrength;

    const r = Math.round(rgb1.r * (1 - effectiveRatio) + rgb2.r * effectiveRatio);
    const g = Math.round(rgb1.g * (1 - effectiveRatio) + rgb2.g * effectiveRatio);
    const b = Math.round(rgb1.b * (1 - effectiveRatio) + rgb2.b * effectiveRatio);

    return this.rgbToHex(r, g, b);
  }

  // 유틸리티 메서드들
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } | null {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h, s, l };
  }

  private hslToHex(h: number, s: number, l: number): string {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return this.rgbToHex(
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    );
  }
}