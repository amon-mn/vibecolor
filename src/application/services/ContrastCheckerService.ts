import type { IContrastCheckerService } from '../../domain/services/IContrastCheckerService';

export class ContrastCheckerService implements IContrastCheckerService {
  static calculateLuminance(rgb: [number, number, number]): number {
    // Conversão para sRGB
    const srgb = rgb.map(v => {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    // Fórmula de luminância relativa
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  }

  static calculateContrastRatio(
    luminance1: number,
    luminance2: number
  ): number {
    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  static checkAccessibility(
    contrastRatio: number,
    level: 'AA' | 'AAA'
  ): boolean {
    if (level === 'AAA') return contrastRatio >= 7;
    return contrastRatio >= 4.5;
  }

  getLuminance(rgb: [number, number, number]): number {
    return ContrastCheckerService.calculateLuminance(rgb);
  }

  getContrast(
    rgbA: [number, number, number],
    rgbB: [number, number, number]
  ): number {
    const lumA = ContrastCheckerService.calculateLuminance(rgbA);
    const lumB = ContrastCheckerService.calculateLuminance(rgbB);
    return ContrastCheckerService.calculateContrastRatio(lumA, lumB);
  }

  isAccessibleAA(contrast: number): boolean {
    return ContrastCheckerService.checkAccessibility(contrast, 'AA');
  }

  isAccessibleAAA(contrast: number): boolean {
    return ContrastCheckerService.checkAccessibility(contrast, 'AAA');
  }
}
