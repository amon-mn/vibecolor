import type { IColor } from '../entities/IColor';

export interface IColorGeneratorService {
  generateRandomColor(): IColor;
  generatePalette(emotionOrStyle: string, numberOfColors: number): IColor[];
} 