import type { IPalette } from '../../domain/entities/IPalette';
import { IPaletteInputSchema } from '../../domain/entities/IPaletteInput.schema';
import type { IPaletteRepository } from '../../domain/services/IPaletteRepository';

export class SavePaletteUseCase {
  static async execute(
    input: IPalette,
    id?: string,
    repo?: IPaletteRepository
  ): Promise<void> {
    IPaletteInputSchema.parse(input); // valida campos obrigatórios
    if (!repo) throw new Error('Repositório não fornecido');
    if (id) {
      // update
      await repo.update(id, { ...input });
    } else {
      // create
      await repo.create({ ...input });
    }
  }
}
