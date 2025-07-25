import type { IColor } from '../../domain/entities/IColor';
import type { IColorGeneratorService } from '../../domain/services/IColorGeneratorService';
import { ContrastCheckerService } from './ContrastCheckerService';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHex(): string {
  return (
    '#' +
    [0, 0, 0]
      .map(() => randomInt(0, 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

function hexToRgb(hex: string): [number, number, number] {
  let sanitized = hex.replace('#', '');
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(sanitized, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export class ColorGeneratorService implements IColorGeneratorService {
  generateRandomColor(): IColor {
    const hex = randomHex();
    const rgb = hexToRgb(hex);
    const luminance = ContrastCheckerService.calculateLuminance(rgb);
    const contrastBlack = ContrastCheckerService.calculateContrastRatio(
      luminance,
      0
    );
    const contrastWhite = ContrastCheckerService.calculateContrastRatio(
      luminance,
      1
    );
    const isAccessibleAA = ContrastCheckerService.checkAccessibility(
      Math.max(contrastBlack, contrastWhite),
      'AA'
    );
    const isAccessibleAAA = ContrastCheckerService.checkAccessibility(
      Math.max(contrastBlack, contrastWhite),
      'AAA'
    );
    return {
      hex,
      rgb,
      luminance,
      contrastBlack,
      contrastWhite,
      isAccessibleAA,
      isAccessibleAAA,
    };
  }

  generatePalette(emotionOrStyle: string, numberOfColors: number): IColor[] {
    return Array.from({ length: numberOfColors }, () =>
      this.generateRandomColor()
    );
  }

  generateHarmonicPalette(
    baseColor: IColor,
    harmonyRule: 'complementary' | 'triadic' | 'analogous',
    numberOfColors: number
  ): IColor[] {
    if (harmonyRule === 'complementary') {
      const [r, g, b] = baseColor.rgb;
      const compRgb: [number, number, number] = [255 - r, 255 - g, 255 - b];
      const compHex =
        '#' + compRgb.map(v => v.toString(16).padStart(2, '0')).join('');
      return [
        baseColor,
        this.generateRandomColor(),
        {
          ...this.generateRandomColor(),
          rgb: compRgb,
          hex: compHex,
        },
      ].slice(0, numberOfColors);
    }
    return this.generatePalette('', numberOfColors);
  }

  extractColorsFromImage(
    imageUrl: string,
    numberOfColors: number
  ): Promise<IColor[]> {
    return Promise.resolve(this.generatePalette('image', numberOfColors));
  }
}
