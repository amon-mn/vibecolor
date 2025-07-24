import type { IColor } from './IColor';

export interface IPaletteInput {
  name: string;
  description?: string;
  colors: IColor[];
  emotionOrStyle: string;
} 