import { NEATConfig } from './types';

export class WaveCalculator {
  private config: NEATConfig;

  constructor(config: NEATConfig) {
    this.config = config;
  }

  updateConfig(config: NEATConfig) {
    this.config = config;
  }

  /**
   * 특정 위치와 시간에서의 웨이브 값을 계산
   */
  calculateWaveAt(x: number, y: number, time: number, width: number, height: number): {
    offsetX: number;
    offsetY: number;
    intensity: number;
  } {
    const normalizedX = x / width;
    const normalizedY = y / height;
    
    // 기본 웨이브 계산
    const waveX = Math.sin(
      time * this.config.speed * 0.01 + 
      normalizedX * this.config.waveFrequencyX * Math.PI * 2
    ) * this.config.waveAmplitude;
    
    const waveY = Math.cos(
      time * this.config.speed * 0.01 + 
      normalizedY * this.config.waveFrequencyY * Math.PI * 2
    ) * this.config.waveAmplitude;

    // 압력 효과 적용
    const pressureX = Math.sin(normalizedY * Math.PI) * this.config.horizontalPressure;
    const pressureY = Math.cos(normalizedX * Math.PI) * this.config.verticalPressure;

    // 최종 오프셋 계산
    const offsetX = (waveX + pressureX) * 0.1;
    const offsetY = (waveY + pressureY) * 0.1;

    // 웨이브 강도 계산 (색상 블렌딩에 사용)
    const intensity = (Math.sin(waveX + waveY + time * 0.001) + 1) * 0.5;

    return { offsetX, offsetY, intensity };
  }

  /**
   * 전체 그리드에 대한 웨이브 데이터 생성
   */
  generateWaveGrid(width: number, height: number, time: number, gridSize: number = 20): {
    points: Array<Array<{ offsetX: number; offsetY: number; intensity: number }>>;
  } {
    const points: Array<Array<{ offsetX: number; offsetY: number; intensity: number }>> = [];
    
    const stepX = width / gridSize;
    const stepY = height / gridSize;

    for (let i = 0; i <= gridSize; i++) {
      points[i] = [];
      for (let j = 0; j <= gridSize; j++) {
        const x = j * stepX;
        const y = i * stepY;
        points[i][j] = this.calculateWaveAt(x, y, time, width, height);
      }
    }

    return { points };
  }

  /**
   * SVG 패스용 웨이브 라인 생성
   */
  generateWavePath(width: number, height: number, time: number, resolution: number = 50): string {
    let path = '';
    const step = width / resolution;
    
    for (let i = 0; i <= resolution; i++) {
      const x = i * step;
      const wave = this.calculateWaveAt(x, height * 0.5, time, width, height);
      const y = height * 0.5 + wave.offsetY * height * 0.3;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path;
  }

  /**
   * 색상 위치 계산 (그라데이션 애니메이션용)
   */
  calculateColorPositions(time: number, colorCount: number): number[] {
    const positions: number[] = [];
    
    for (let i = 0; i < colorCount; i++) {
      const basePosition = i / (colorCount - 1);
      const wave = Math.sin(time * this.config.speed * 0.002 + i * Math.PI * 0.5) * 0.1;
      positions.push(Math.max(0, Math.min(1, basePosition + wave)));
    }
    
    return positions;
  }
}