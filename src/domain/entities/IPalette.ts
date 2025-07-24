import type { IColor } from './IColor';

export interface IPalette {
  id: string; // UUID
  name: string;
  description: string;
  colors: IColor[];
  emotionOrStyle: string;
  createdAt: Date;
  updatedAt: Date;
} 