import React, { useState, useRef } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ContrastCheckerService } from '../../application/services/ContrastCheckerService';

function simulateDaltonism(
  hex: string,
  type: 'protanopia' | 'deuteranopia' | 'tritanopia'
): string {
  // Simulação básica: aplica um filtro de cor (apenas para visualização)
  // Para produção, use uma lib como color-blind ou implementações mais realistas
  if (type === 'protanopia') return '#bcbcbc';
  if (type === 'deuteranopia') return '#a0a0a0';
  if (type === 'tritanopia') return '#c0c0c0';
  return hex;
}

// Lista de citações de filósofos famosos
const CITACOES = [
  {
    texto: 'O homem é a medida de todas as coisas.',
    autor: 'Protágoras',
  },
  {
    texto: 'Só sei que nada sei.',
    autor: 'Sócrates',
  },
  {
    texto: 'A felicidade é o sentido e o propósito da vida.',
    autor: 'Aristóteles',
  },
  {
    texto: 'Penso, logo existo.',
    autor: 'René Descartes',
  },
  {
    texto: 'A vida deve ser vivida como uma brincadeira.',
    autor: 'Platão',
  },
  {
    texto: 'A liberdade é a possibilidade do isolamento.',
    autor: 'Jean-Paul Sartre',
  },
  {
    texto: 'O homem nasce livre, e por toda parte encontra-se acorrentado.',
    autor: 'Jean-Jacques Rousseau',
  },
  {
    texto: 'A dúvida é o princípio da sabedoria.',
    autor: 'Aristóteles',
  },
];

function getRandomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

// Função utilitária para converter hex para HSL
function hexToHsl(hex: string): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
// Função utilitária para converter HSL para hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color =
      l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
// Função para ajustar o contraste de uma cor (clarear ou escurecer)
function ajustarContraste(hex: string, escurecer: boolean): string {
  let [h, s, l] = hexToHsl(hex);
  if (escurecer) {
    l = Math.max(0, l - 20);
  } else {
    l = Math.min(100, l + 20);
  }
  return hslToHex(h, s, l);
}

// Função utilitária para converter hex para RGB
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
// Função para encontrar a melhor cor (texto ou fundo) para maximizar contraste
function encontrarMelhorCor(
  baseHex: string,
  outraHex: string,
  ajustarTexto: boolean
) {
  let melhorCor = baseHex;
  let melhorContraste = 0;
  const [h, s, l] = hexToHsl(baseHex);
  for (let delta = -50; delta <= 50; delta += 2) {
    const novaL = Math.max(0, Math.min(100, l + delta));
    const novaCor = hslToHex(h, s, novaL);
    const rgbA = ajustarTexto ? hexToRgb(novaCor) : hexToRgb(outraHex);
    const rgbB = ajustarTexto ? hexToRgb(outraHex) : hexToRgb(novaCor);
    const lumA = ContrastCheckerService.calculateLuminance(rgbA);
    const lumB = ContrastCheckerService.calculateLuminance(rgbB);
    const contraste = ContrastCheckerService.calculateContrastRatio(lumA, lumB);
    if (contraste > melhorContraste) {
      melhorContraste = contraste;
      melhorCor = novaCor;
    }
    if (contraste >= 7) break; // AAA
  }
  return melhorCor;
}
// Função para encontrar a melhor combinação de ambas as cores
function encontrarMelhorAmbas(hexA: string, hexB: string) {
  let melhorA = hexA;
  let melhorB = hexB;
  let melhorContraste = 0;
  const [hA, sA, lA] = hexToHsl(hexA);
  const [hB, sB, lB] = hexToHsl(hexB);
  for (let deltaA = -50; deltaA <= 50; deltaA += 10) {
    const novaLA = Math.max(0, Math.min(100, lA + deltaA));
    const novaCorA = hslToHex(hA, sA, novaLA);
    for (let deltaB = -50; deltaB <= 50; deltaB += 10) {
      const novaLB = Math.max(0, Math.min(100, lB + deltaB));
      const novaCorB = hslToHex(hB, sB, novaLB);
      const rgbA = hexToRgb(novaCorA);
      const rgbB = hexToRgb(novaCorB);
      const lumA = ContrastCheckerService.calculateLuminance(rgbA);
      const lumB = ContrastCheckerService.calculateLuminance(rgbB);
      const contraste = ContrastCheckerService.calculateContrastRatio(
        lumA,
        lumB
      );
      if (contraste > melhorContraste) {
        melhorContraste = contraste;
        melhorA = novaCorA;
        melhorB = novaCorB;
      }
      if (contraste >= 7) return [novaCorA, novaCorB]; // AAA
    }
  }
  return [melhorA, melhorB];
}

export default function ContrastCheckerPage() {
  const [colorA, setColorA] = useState('#000000');
  const [colorB, setColorB] = useState('#ffffff');
  const [daltonism, setDaltonism] = useState<
    'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  >('none');
  // Sorteia uma citação ao montar a página
  const [citacaoIndex] = useState(() => getRandomIndex(CITACOES.length));
  const citacao = CITACOES[citacaoIndex];

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Função para sugerir uma combinação de cores com contraste melhor
  function sugerirMelhorContraste() {
    // Sugestão simples: preto no branco
    setColorA('#000000');
    setColorB('#ffffff');
  }

  // Funções para cada ajuste
  function ajustarTexto() {
    setColorA(encontrarMelhorCor(colorA, colorB, true));
    setShowDropdown(false);
  }
  function ajustarFundo() {
    setColorB(encontrarMelhorCor(colorB, colorA, false));
    setShowDropdown(false);
  }
  function ajustarAmbos() {
    const [novaA, novaB] = encontrarMelhorAmbas(colorA, colorB);
    setColorA(novaA);
    setColorB(novaB);
    setShowDropdown(false);
  }
  // Fecha dropdown ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const rgbA = [
    parseInt(colorA.slice(1, 3), 16),
    parseInt(colorA.slice(3, 5), 16),
    parseInt(colorA.slice(5, 7), 16),
  ] as [number, number, number];
  const rgbB = [
    parseInt(colorB.slice(1, 3), 16),
    parseInt(colorB.slice(3, 5), 16),
    parseInt(colorB.slice(5, 7), 16),
  ] as [number, number, number];
  const lumA = ContrastCheckerService.calculateLuminance(rgbA);
  const lumB = ContrastCheckerService.calculateLuminance(rgbB);
  const contrast = ContrastCheckerService.calculateContrastRatio(lumA, lumB);
  const isAA = ContrastCheckerService.checkAccessibility(contrast, 'AA');
  const isAAA = ContrastCheckerService.checkAccessibility(contrast, 'AAA');

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-2">
      {/* Título e subtítulo */}
      <h1 className="text-4xl font-extrabold mb-2 text-center">
        Verificador de contraste de cores
      </h1>
      <p className="mb-8 text-lg text-gray-600 text-center">
        Calcule a taxa de contraste das cores do texto e do fundo.
      </p>
      {/* Card principal dividido */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-0 flex flex-col md:flex-row overflow-hidden mb-10">
        {/* Lado esquerdo: Inputs e resultado */}
        <div className="flex-1 p-8 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <label className="font-medium text-gray-700">Cor do texto</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorA}
                  onChange={e => setColorA(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={colorA}
                  onChange={e => setColorA(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <label className="font-medium text-gray-700">Cor de fundo</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorB}
                  onChange={e => setColorB(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={colorB}
                  onChange={e => setColorB(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center mt-2">
            <label className="font-medium mb-1">Simular Daltonismo:</label>
            <select
              value={daltonism}
              onChange={e => setDaltonism(e.target.value as any)}
              className="rounded border px-3 py-2 w-full md:w-48"
            >
              <option value="none">Nenhum</option>
              <option value="protanopia">Protanopia</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="tritanopia">Tritanopia</option>
            </select>
          </div>
          {/* Resultado do contraste */}
          <div
            className={`mt-4 rounded-lg p-4 flex flex-col items-center ${contrast < 3 ? 'bg-red-100' : contrast < 4.5 ? 'bg-yellow-100' : 'bg-green-100'} relative pb-24`}
          >
            <div
              className={`text-4xl font-extrabold mb-1 ${contrast < 3 ? 'text-red-700' : contrast < 4.5 ? 'text-yellow-700' : 'text-green-700'}`}
            >
              {contrast.toFixed(2)}
            </div>
            <div
              className={`text-lg font-semibold mb-2 ${contrast < 3 ? 'text-red-700' : contrast < 4.5 ? 'text-yellow-700' : 'text-green-700'}`}
            >
              {contrast >= 7
                ? 'Excelente'
                : contrast >= 4.5
                  ? 'Muito bom'
                  : contrast >= 3
                    ? 'Regular'
                    : 'Ruim'}
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <span
                  key={i}
                  className={
                    contrast >= 7
                      ? 'text-green-700'
                      : contrast >= 4.5
                        ? 'text-green-500'
                        : contrast >= 3
                          ? 'text-yellow-500'
                          : 'text-red-500'
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <span
                className={
                  isAA
                    ? 'text-green-600 font-semibold'
                    : 'text-red-600 font-semibold'
                }
              >
                {isAA ? '✔️ Texto pequeno AA' : '❌ Texto pequeno AA'}
              </span>
              <span
                className={
                  isAAA
                    ? 'text-green-600 font-semibold'
                    : 'text-red-600 font-semibold'
                }
              >
                {isAAA ? '✔️ Texto grande AAA' : '❌ Texto grande AAA'}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-2 text-center">
              Bom contraste para textos pequenos (abaixo de 18pt) e ótimo
              contraste para textos grandes (acima de 18pt ou negrito acima de
              14pt).
              <br />
              <div className="relative inline-block">
                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={() => setShowDropdown(v => !v)}
                >
                  Clique para corrigir
                </button>
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 top-full mt-2 bg-white border rounded shadow-lg z-[9999] min-w-[200px] text-left"
                  >
                    <button
                      className="block w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={ajustarTexto}
                    >
                      Ajustar a cor do texto
                    </button>
                    <button
                      className="block w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={ajustarFundo}
                    >
                      Ajustar cor de fundo
                    </button>
                    <button
                      className="block w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={ajustarAmbos}
                    >
                      Ajuste ambas as cores
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Lado direito: Preview visual */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-50 min-h-[320px]">
          <div
            className="w-full h-full flex flex-col items-center justify-center rounded-lg p-6"
            style={{
              background:
                daltonism !== 'none'
                  ? simulateDaltonism(colorB, daltonism as any)
                  : colorB,
            }}
          >
            <div
              className="text-base font-bold mb-2 text-center"
              style={{
                color:
                  daltonism !== 'none'
                    ? simulateDaltonism(colorA, daltonism as any)
                    : colorA,
              }}
            >
              "{citacao.texto}"
            </div>
            <div
              className="text-sm font-semibold mt-2 text-center"
              style={{
                color:
                  daltonism !== 'none'
                    ? simulateDaltonism(colorA, daltonism as any)
                    : colorA,
              }}
            >
              {citacao.autor}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
