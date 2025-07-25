export interface IColor {
  hex: string;
  rgb: [number, number, number];
  luminance: number;
  contrastBlack: number;
  contrastWhite: number;
  isAccessibleAA: boolean;
  isAccessibleAAA: boolean;
}
