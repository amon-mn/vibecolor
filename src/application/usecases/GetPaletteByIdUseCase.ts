import type { IPalette } from '../../domain/entities/IPalette';
import type { IPaletteRepository } from '../../domain/services/IPaletteRepository';

export class GetPaletteByIdUseCase {
  static async execute(repo: IPaletteRepository, id: string): Promise<IPalette | null> {
    return await repo.getById(id);
  }
} 