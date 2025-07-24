import type { IPaletteInput } from '../../domain/entities/IPaletteInput';
import { IPaletteInputSchema } from '../../domain/entities/IPaletteInput.schema';
import type { IPaletteRepository } from '../../domain/services/IPaletteRepository';

export class SavePaletteUseCase {
  static async execute(input: IPaletteInput, id?: string, repo?: IPaletteRepository): Promise<void> {
    IPaletteInputSchema.parse(input);
    if (!repo) throw new Error('Repositório não fornecido');
    if (id) {
      // update
      await repo.update(id, { ...input } as any);
    } else {
      // create
      await repo.create({ ...input } as any);
    }
  }
} 