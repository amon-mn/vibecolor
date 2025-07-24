import type { IPalette } from '../entities/IPalette';
import type { IPaletteInput } from '../entities/IPaletteInput';

export interface IPaletteRepository {
  getAll(): Promise<IPalette[]>;
  getById(id: string): Promise<IPalette | null>;
  create(input: IPaletteInput): Promise<IPalette>;
  update(id: string, input: IPaletteInput): Promise<IPalette>;
  delete(id: string): Promise<void>;
} 