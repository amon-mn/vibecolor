import type { IPalette } from '../../domain/entities/IPalette';
import type { IPaletteRepository } from '../../domain/services/IPaletteRepository';

export class GetAllPalettesUseCase {
  static async execute(repo: IPaletteRepository): Promise<IPalette[]> {
    return await repo.getAll();
  }
}
