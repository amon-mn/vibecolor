import type { IColor } from '../../domain/entities/IColor';
import type { IPalette } from '../../domain/entities/IPalette';
import { ColorGeneratorService } from '../services/ColorGeneratorService';
import { v4 as uuidv4 } from 'uuid';

interface GeneratePaletteOptions {
  baseColor?: IColor;
  harmonyRule?: 'complementary' | 'triadic' | 'analogous';
  imageUrl?: string;
  numberOfColors?: number;
}

type GenerationMethod = 'random' | 'harmonic' | 'fromImage';

export class GeneratePaletteUseCase {
  static async execute(
    emotionOrStyle: string,
    generationMethod: GenerationMethod,
    options: GeneratePaletteOptions = {}
  ): Promise<IPalette> {
    const colorService = new ColorGeneratorService();
    let colors: IColor[] = [];
    const numberOfColors = options.numberOfColors || 5;

    if (generationMethod === 'random') {
      colors = colorService.generatePalette(emotionOrStyle, numberOfColors);
    } else if (
      generationMethod === 'harmonic' &&
      options.baseColor &&
      options.harmonyRule
    ) {
      colors = colorService.generateHarmonicPalette(
        options.baseColor,
        options.harmonyRule,
        numberOfColors
      );
    } else if (generationMethod === 'fromImage' && options.imageUrl) {
      colors = await colorService.extractColorsFromImage(
        options.imageUrl,
        numberOfColors
      );
    } else {
      throw new Error('Parâmetros insuficientes para geração de paleta.');
    }

    const now = new Date();
    return {
      id: uuidv4(),
      name: `Paleta ${emotionOrStyle}`,
      description: '',
      colors,
      emotionOrStyle,
      createdAt: now,
      updatedAt: now,
    };
  }
}
