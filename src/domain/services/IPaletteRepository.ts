import type { IPalette } from '../entities/IPalette';

export interface IPaletteRepository {
  getAll(): Promise<IPalette[]>;
  getById(id: string): Promise<IPalette | null>;
  create(input: IPalette): Promise<IPalette>;
  update(id: string, input: IPalette): Promise<IPalette>;
  delete(id: string): Promise<void>;
}
