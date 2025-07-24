import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ContrastCheckerService } from '../../application/services/ContrastCheckerService';

function simulateDaltonism(hex: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia'): string {
  // Simulação básica: aplica um filtro de cor (apenas para visualização)
  // Para produção, use uma lib como color-blind ou implementações mais realistas
  if (type === 'protanopia') return '#bcbcbc';
  if (type === 'deuteranopia') return '#a0a0a0';
  if (type === 'tritanopia') return '#c0c0c0';
  return hex;
}

export default function ContrastCheckerPage() {
  const [colorA, setColorA] = useState('#000000');
  const [colorB, setColorB] = useState('#ffffff');
  const [daltonism, setDaltonism] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('none');

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
    <main className="max-w-xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Ferramenta de Checagem de Contraste</h1>
      <div className="flex gap-4 mb-4">
        <Input label="Cor 1 (hex)" value={colorA} onChange={e => setColorA(e.target.value)} className="w-40" />
        <Input label="Cor 2 (hex)" value={colorB} onChange={e => setColorB(e.target.value)} className="w-40" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Simular Daltonismo:</label>
        <select value={daltonism} onChange={e => setDaltonism(e.target.value as any)} className="rounded border px-3 py-2">
          <option value="none">Nenhum</option>
          <option value="protanopia">Protanopia</option>
          <option value="deuteranopia">Deuteranopia</option>
          <option value="tritanopia">Tritanopia</option>
        </select>
      </div>
      <div className="flex gap-8 items-center mb-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded mb-2 border" style={{ background: simulateDaltonism(colorA, daltonism) }}></div>
          <span className="text-xs">Cor 1</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded mb-2 border" style={{ background: simulateDaltonism(colorB, daltonism) }}></div>
          <span className="text-xs">Cor 2</span>
        </div>
      </div>
      <div className="mb-2">Razão de contraste: <span className="font-mono font-bold">{contrast.toFixed(2)}:1</span></div>
      <div className="mb-2">
        <span className={isAA ? 'text-green-600' : 'text-red-600'}>{isAA ? '✔️ Passa AA' : '❌ Não passa AA'}</span>
        <span className="ml-4" />
        <span className={isAAA ? 'text-green-600' : 'text-red-600'}>{isAAA ? '✔️ Passa AAA' : '❌ Não passa AAA'}</span>
      </div>
    </main>
  );
} 