// Gera uma cor hexadecimal aleatória
export function randomHexColor(): string {
  return (
    '#' +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')
  );
}

// Converte um código hexadecimal para RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let sanitized = hex.replace('#', '');
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(sanitized, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Calcula a luminância de uma cor RGB
export function luminance({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): number {
  // Conversão para sRGB
  const srgb = [r, g, b].map(v => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  // Fórmula de luminância relativa
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

// Calcula a razão de contraste entre duas cores (hex ou RGB)
export function contrastRatio(
  colorA: string | { r: number; g: number; b: number },
  colorB: string | { r: number; g: number; b: number }
): number {
  const rgbA = typeof colorA === 'string' ? hexToRgb(colorA) : colorA;
  const rgbB = typeof colorB === 'string' ? hexToRgb(colorB) : colorB;
  const lumA = luminance(rgbA);
  const lumB = luminance(rgbB);
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return (brightest + 0.05) / (darkest + 0.05);
}
