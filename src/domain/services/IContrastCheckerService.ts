

export interface IContrastCheckerService {
  getLuminance(rgb: [number, number, number]): number;
  getContrast(rgbA: [number, number, number], rgbB: [number, number, number]): number;
  isAccessibleAA(contrast: number): boolean;
  isAccessibleAAA(contrast: number): boolean;
} 